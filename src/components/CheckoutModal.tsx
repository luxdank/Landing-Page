import React, { useState } from 'react';
import { Plan } from '../types';
import { X, CheckCircle2, ArrowRight, ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import { getAccessToken } from '../services/googleAuth';
import { getSavedSpreadsheetId, appendLeadToGoogleSheet } from '../services/googleSheets';

interface CheckoutModalProps {
  plan: Plan;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  plan,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [neighborhood, setNeighborhood] = useState('Belford Roxo');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    const leadData = {
      name,
      cpf,
      phone,
      email,
      neighborhood,
      cep,
      street,
      number,
      complement,
      planName: `${plan.name} ${plan.subtitle}`.trim(),
      planPrice: `R$ ${plan.priceFidelity.toFixed(2).replace('.', ',')}`,
    };

    // 1. Try appending directly to connected Google Sheets (OAuth or Apps Script Webhook)
    try {
      const appsScriptUrl = localStorage.getItem('novaisp_apps_script_url');
      if (appsScriptUrl) {
        fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...leadData,
            dataHora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
          }),
        }).catch((e) => console.warn('Apps script post error:', e));
      }

      const token = await getAccessToken();
      const spreadsheetId = getSavedSpreadsheetId();
      if (token && spreadsheetId) {
        await appendLeadToGoogleSheet(token, spreadsheetId, leadData);
      }
    } catch (err) {
      console.warn('Google Sheets append notice:', err);
    }

    // 2. Also send data to server-side backup spreadsheet (/api/leads)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          date: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.warn('Fallback to local storage for spreadsheet recording:', err);
    }

    // 3. Backup to localStorage spreadsheet
    try {
      const existing = JSON.parse(localStorage.getItem('novaisp_planilha_leads') || '[]');
      existing.push({ ...leadData, date: new Date().toISOString() });
      localStorage.setItem('novaisp_planilha_leads', JSON.stringify(existing));
    } catch (err) {
      console.error(err);
    }

    // 4. Format message and WhatsApp redirect
    // Number: (21) 2762-5350 -> 552127625350
    const chosenServiceName = `${plan.name} ${plan.subtitle}`.trim();
    const formattedComplement = complement
      ? complement.trim().startsWith('(') && complement.trim().endsWith(')')
        ? ` ${complement.trim()}`
        : ` (${complement.trim()})`
      : '';
    const addressFormatted = `${street}, nº ${number}${formattedComplement}`;

    const message = `Olá! Acabei de me cadastrar pelo site da Nova ISP e desejo concluir minha contratação.\n\n*Serviço / Plano Escolhido:* ${chosenServiceName} (R$ ${plan.priceFidelity.toFixed(2).replace('.', ',')}/mês)\n\n*Meus Dados:*\n- *Nome:* ${name}\n- *CPF:* ${cpf}\n- *Telefone:* ${phone}\n- *E-mail:* ${email}\n- *Endereço:* ${addressFormatted}\n- *Bairro:* ${neighborhood}\n- *CEP:* ${cep}\n\nAguardo o retorno para agendamento!`;

    const whatsappUrl = `https://wa.me/552127625350?text=${encodeURIComponent(message)}`;
    setRedirectUrl(whatsappUrl);

    // Call success callback
    onSuccess();

    // Redirect to WhatsApp
    setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                step >= 1 ? 'bg-[#e6007e] text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              1
            </span>
            <span
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                step >= 2 ? 'bg-[#e6007e] text-white' : 'bg-slate-100 text-slate-400'
              }`}
            >
              2
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {step === 1 ? 'Confirmar Plano' : 'Dados do Assinante & Endereço'}
          </span>
        </div>

        {/* STEP 1: PLAN DETAILS */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#7738b5] uppercase">
                  {plan.id === 'plan-telemedicina' ? 'Serviço Digital de Saúde' : 'Plano Residencial Nova ISP'}
                </span>
                <h3 className="text-2xl font-black text-[#1e1b4b]">
                  {plan.name} {plan.subtitle}
                </h3>
                <div className="text-xs text-slate-600 mt-1">
                  {plan.id === 'plan-telemedicina'
                    ? `${plan.speed} • Parceria SulAmérica`
                    : `Velocidade: ${plan.download} • ${plan.upload}`}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-semibold">
                  {plan.id === 'plan-telemedicina' ? 'Valor Mensal' : 'Com fidelidade'}
                </div>
                <div className="text-2xl font-black text-[#1e1b4b] tabular-nums">
                  R$ {plan.priceFidelity.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-[10px] text-slate-400">/mês</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Benefícios Inclusos na Assinatura:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plan.includedServices.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PERSONAL & ADDRESS DATA */}
        {step === 2 && !redirectUrl && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">Dados do Titular</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#e6007e] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CPF</label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#e6007e] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Celular</label>
                <input
                  type="text"
                  required
                  placeholder="(21) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#e6007e] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#e6007e] focus:outline-none"
                />
              </div>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 pt-2">Endereço de Instalação</h3>

            {/* Campo Bairro com 3 opções */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Bairro</span>
                <span className="text-[11px] text-purple-700 font-semibold">Região de Cobertura Nova ISP</span>
              </label>

              {/* Botões de seleção rápida das 3 opções */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                {(['Belford Roxo', 'Duque de Caxias', 'Piabetá'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setNeighborhood(opt)}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      neighborhood === opt
                        ? 'bg-[#7738b5] text-white border-[#7738b5] shadow-sm ring-2 ring-purple-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Select tradicional */}
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#e6007e] focus:outline-none bg-white font-medium text-slate-800"
              >
                <option value="Belford Roxo">Belford Roxo</option>
                <option value="Duque de Caxias">Duque de Caxias</option>
                <option value="Piabetá">Piabetá</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">CEP</label>
                <input
                  type="text"
                  required
                  placeholder="26182-010"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#e6007e] focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Rua / Avenida</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rua Lamartine Júnior"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#e6007e] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Número</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 12"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#e6007e] focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Complemento / Apto</label>
                <input
                  type="text"
                  placeholder="Ex: Bloco C, Apto 102"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#e6007e] focus:outline-none"
                />
              </div>
            </div>
          </form>
        )}

        {/* REDIRECTION STATE TO WHATSAPP */}
        {redirectUrl && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Dados Salvos na Planilha com Sucesso!
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Redirecionando você para o WhatsApp da Nova ISP:{' '}
              <strong className="text-emerald-700 font-bold">(21) 2762-5350</strong>...
            </p>
            <div className="pt-2">
              <a
                href={redirectUrl}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Clique aqui se não abrir automaticamente</span>
              </a>
            </div>
          </div>
        )}

        {/* Modal Action Buttons */}
        {!redirectUrl && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            ) : (
              <div></div>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-gradient-to-r from-[#e6007e] to-[#7928ca] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer ml-auto"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit()}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer ml-auto disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Salvando na Planilha...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar e Ir para o WhatsApp (21) 2762-5350</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
