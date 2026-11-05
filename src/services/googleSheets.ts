export interface LeadPayload {
  name: string;
  phone: string;
  cep: string;
  cpf?: string;
  email?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  complement?: string;
  planName: string;
  planPrice: string;
}

const SPREADSHEET_ID_KEY = 'novaisp_active_spreadsheet_id';
const APPS_SCRIPT_URL_KEY = 'novaisp_apps_script_url';

export const getSavedSpreadsheetId = (): string | null => {
  return localStorage.getItem(SPREADSHEET_ID_KEY);
};

export const saveSpreadsheetId = (id: string): void => {
  localStorage.setItem(SPREADSHEET_ID_KEY, id);
};

export const clearSpreadsheetId = (): void => {
  localStorage.removeItem(SPREADSHEET_ID_KEY);
};

export const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyKAY8xDvPkgjMowhNDeFqPYq07GQ_BjsrJQbtSsD6jotkhSkNA6oJ9qZrfZNxBZ6tL-w/exec';

export const getSavedAppsScriptUrl = (): string => {
  return localStorage.getItem(APPS_SCRIPT_URL_KEY) || DEFAULT_APPS_SCRIPT_URL;
};

export const saveAppsScriptUrl = (url: string): void => {
  localStorage.setItem(APPS_SCRIPT_URL_KEY, url);
};

/**
 * Código em Google Apps Script (JavaScript) para colar diretamente em:
 * Google Sheets > Extensões > Apps Script
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Código para Google Sheets da Nova ISP
 * Cole este código em: Extensões > Apps Script
 * Depois clique em Implantar > Nova Implantação > App da Web
 * IMPORTANTE: Configure "Quem pode acessar" como "Qualquer pessoa" (Anyone)
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Se a planilha estiver vazia, cria os cabeçalhos formatados
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Data/Hora",
        "Nome Completo",
        "WhatsApp / Telefone",
        "CEP",
        "Plano Escolhido",
        "Valor Mensal",
        "Status"
      ]);
      
      var headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setBackground("#1f0d38");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    
    // Lê os dados do lead enviados pelo site
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    var dataHora = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
    
    // Identifica se a planilha existente usa o modelo estendido (12 ou 13 colunas)
    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var isLegacyWide = headers.length >= 10;
    
    if (isLegacyWide) {
      // Formato compatível com a planilha que possui colunas de CPF, Email e Endereço
      sheet.appendRow([
        dataHora,
        data.name || "",
        data.cpf || "",
        data.phone || "",
        data.email || "",
        data.neighborhood || "",
        data.cep || "",
        data.street || "",
        data.number || "",
        data.complement || "",
        data.planName || "",
        data.planPrice || "",
        "Novo Lead (WhatsApp)"
      ]);
    } else {
      // Formato compacto (Nome, Contato e CEP)
      sheet.appendRow([
        dataHora,
        data.name || "",
        data.phone || "",
        data.cep || "",
        data.planName || "",
        data.planPrice || "",
        "Novo Lead (WhatsApp)"
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Lead gravado com sucesso!"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

/**
 * Envia o lead diretamente para a URL do Google Apps Script Web App
 */
export const sendLeadToAppsScript = async (
  webhookUrl: string,
  lead: LeadPayload
): Promise<boolean> => {
  try {
    const payload = {
      ...lead,
      dataHora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    };

    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (err) {
    console.warn('Erro ao enviar para Google Apps Script Web App:', err);
    return false;
  }
};

/**
 * Creates a new Google Sheets spreadsheet with headers for Nova ISP leads via REST API
 */
export const createNewLeadSpreadsheet = async (accessToken: string): Promise<string> => {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: `Nova ISP - Leads de Contratação (${new Date().toLocaleDateString('pt-BR')})`,
      },
      sheets: [
        {
          properties: {
            title: 'Leads',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Falha ao criar planilha: ${errorText}`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;

  // Add Headers
  const headerValues = [
    [
      'Data/Hora',
      'Nome Completo',
      'CPF',
      'WhatsApp / Celular',
      'E-mail',
      'Bairro',
      'CEP',
      'Rua / Avenida',
      'Número',
      'Complemento',
      'Plano Escolhido',
      'Valor Mensal',
      'Status',
    ],
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Leads!A1:M1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: headerValues,
      }),
    }
  );

  saveSpreadsheetId(spreadsheetId);
  return spreadsheetId;
};

/**
 * Appends a lead row to the active Google Spreadsheet via REST API
 */
export const appendLeadToGoogleSheet = async (
  accessToken: string,
  spreadsheetId: string,
  lead: LeadPayload
): Promise<boolean> => {
  const dateStr = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const values = [
    [
      dateStr,
      lead.name || '',
      lead.cpf || '',
      lead.phone || '',
      lead.email || '',
      lead.neighborhood || '',
      lead.cep || '',
      lead.street || '',
      lead.number || '',
      lead.complement || '',
      lead.planName || '',
      lead.planPrice || '',
      'Novo Lead (WhatsApp)',
    ],
  ];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error('Erro ao enviar lead para o Google Sheets:', errText);
    return false;
  }

  return true;
};

/**
 * Reads lead rows from the active Google Spreadsheet via REST API
 */
export const getLeadSpreadsheetRows = async (
  accessToken: string,
  spreadsheetId: string
): Promise<string[][]> => {
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!metaRes.ok) {
    throw new Error('Não foi possível ler as informações da planilha.');
  }

  const metaData = await metaRes.json();
  const firstSheetTitle = metaData.sheets?.[0]?.properties?.title || 'Sheet1';

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      firstSheetTitle
    )}!A1:Z100`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    throw new Error('Falha ao obter os valores da planilha.');
  }

  const data = await res.json();
  return data.values || [];
};
