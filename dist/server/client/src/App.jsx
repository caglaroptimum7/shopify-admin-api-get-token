"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const lucide_react_1 = require("lucide-react");
const DEFAULT_SCOPES = 'read_products,write_products,read_files,write_files,read_themes';
const REDIRECT_URI = 'http://localhost:3456/callback';
function App() {
    const [state, setState] = (0, react_1.useState)(() => {
        const saved = localStorage.getItem('shopify_wizard_state');
        return saved ? JSON.parse(saved) : {
            clientId: '',
            clientSecret: '',
            scopes: DEFAULT_SCOPES,
            shop: '',
        };
    });
    (0, react_1.useEffect)(() => {
        localStorage.setItem('shopify_wizard_state', JSON.stringify(state));
    }, [state]);
    return (<div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-lg mb-4">
            <lucide_react_1.Rocket className="w-8 h-8 text-white"/>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Shopify Token Wizard</h1>
          <p className="text-slate-600">Quickly generate an Admin API Access Token for local development.</p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <react_router_dom_1.Routes>
            <react_router_dom_1.Route path="/" element={<Wizard state={state} setState={setState}/>}/>
            <react_router_dom_1.Route path="/callback" element={<Callback state={state}/>}/>
          </react_router_dom_1.Routes>
        </div>
        
        <footer className="mt-8 text-center text-slate-400 text-sm">
          <p>This tool is for local development. Your credentials are stored in your browser's local storage.</p>
        </footer>
      </div>
    </div>);
}
function Wizard({ state, setState }) {
    const [step, setStep] = (0, react_1.useState)(1);
    const updateState = (key, value) => {
        setState(prev => ({ ...prev, [key]: value }));
    };
    const handleAuthorize = () => {
        const shop = state.shop.includes('.myshopify.com') ? state.shop : `${state.shop}.myshopify.com`;
        const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${state.clientId}&scope=${state.scopes}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        window.location.href = authUrl;
    };
    return (<div>
      {/* Progress Bar */}
      <div className="flex border-b border-slate-100">
        {[1, 2, 3].map((s) => (<div key={s} className={`flex-1 py-4 text-center text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${step === s ? 'text-indigo-600 border-b-2 border-indigo-600' :
                step > s ? 'text-slate-900' : 'text-slate-300'}`}>
            Step {s}: {s === 1 ? 'Credentials' : s === 2 ? 'Store' : 'Authorize'}
          </div>))}
      </div>

      <div className="p-8">
        {step === 1 && (<div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <lucide_react_1.Settings className="w-4 h-4"/> Client ID (API Key)
              </label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="f763..." value={state.clientId} onChange={(e) => updateState('clientId', e.target.value)}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <lucide_react_1.Key className="w-4 h-4"/> Client Secret
              </label>
              <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="shpss_..." value={state.clientSecret} onChange={(e) => updateState('clientSecret', e.target.value)}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <lucide_react_1.ShieldCheck className="w-4 h-4"/> Scopes
              </label>
              <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" rows={2} placeholder="read_products, write_products..." value={state.scopes} onChange={(e) => updateState('scopes', e.target.value)}/>
            </div>
            <button onClick={() => setStep(2)} disabled={!state.clientId || !state.clientSecret} className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
              Continue <lucide_react_1.ChevronRight className="w-4 h-4"/>
            </button>
          </div>)}

        {step === 2 && (<div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <lucide_react_1.Store className="w-4 h-4"/> Store Domain
              </label>
              <div className="relative">
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="my-cool-store" value={state.shop.replace('.myshopify.com', '')} onChange={(e) => updateState('shop', e.target.value)}/>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                  .myshopify.com
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98]">
                <lucide_react_1.ChevronLeft className="w-4 h-4"/> Back
              </button>
              <button onClick={() => setStep(3)} disabled={!state.shop} className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                Connect Store <lucide_react_1.ChevronRight className="w-4 h-4"/>
              </button>
            </div>
          </div>)}

        {step === 3 && (<div className="space-y-8 text-center animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-600 mb-4">You're ready to authorize your app for:</p>
              <p className="text-xl font-bold text-slate-900">{state.shop.includes('.myshopify.com') ? state.shop : `${state.shop}.myshopify.com`}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98]">
                <lucide_react_1.ChevronLeft className="w-4 h-4"/> Back
              </button>
              <button onClick={handleAuthorize} className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                Authorize App <lucide_react_1.ExternalLink className="w-4 h-4"/>
              </button>
            </div>
          </div>)}
      </div>
    </div>);
}
function Callback({ state }) {
    const [searchParams] = (0, react_router_dom_1.useSearchParams)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [token, setToken] = (0, react_1.useState)(null);
    const [scopes, setScopes] = (0, react_1.useState)(null);
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        const exchangeToken = async () => {
            const code = searchParams.get('code');
            const shop = searchParams.get('shop');
            if (!code || !shop) {
                setError('Missing code or shop parameter');
                setLoading(false);
                return;
            }
            try {
                const response = await fetch('/api/exchange-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        clientId: state.clientId,
                        clientSecret: state.clientSecret,
                        code,
                        shop
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    setToken(data.access_token);
                    setScopes(data.scope);
                }
                else {
                    setError(data.error || 'Failed to exchange token');
                }
            }
            catch (err) {
                setError('Connection error: ' + err.message);
            }
            finally {
                setLoading(false);
            }
        };
        exchangeToken();
    }, [searchParams, state]);
    const copyToClipboard = () => {
        if (token) {
            navigator.clipboard.writeText(token);
            alert('Token copied to clipboard!');
        }
    };
    if (loading) {
        return (<div className="p-16 text-center">
        <lucide_react_1.RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-6"/>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Exchanging Code...</h2>
        <p className="text-slate-500">Connecting to Shopify to retrieve your access token.</p>
      </div>);
    }
    if (error) {
        return (<div className="p-12 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <lucide_react_1.ChevronLeft className="w-8 h-8 text-red-600"/>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-red-500 mb-8">{error}</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all">
          Try Again
        </button>
      </div>);
    }
    return (<div className="p-10 animate-in zoom-in-95 duration-500">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <lucide_react_1.CheckCircle2 className="w-8 h-8 text-green-600"/>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
        <p className="text-slate-500">Your Shopify Admin API access token is ready.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-2">Access Token</label>
          <div className="relative group">
            <input readOnly className="w-full px-4 py-4 pr-14 bg-slate-900 text-green-400 font-mono text-sm rounded-xl border-none outline-none ring-2 ring-transparent group-hover:ring-indigo-500/50 transition-all" value={token || ''}/>
            <button onClick={copyToClipboard} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-all" title="Copy to clipboard">
              <lucide_react_1.Copy className="w-5 h-5"/>
            </button>
          </div>
        </div>

        {scopes && (<div>
            <label className="block text-sm font-medium text-slate-500 mb-2">Authorized Scopes</label>
            <div className="flex flex-wrap gap-2">
              {scopes.split(',').map((s) => (<span key={s} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                  {s.trim()}
                </span>))}
            </div>
          </div>)}
      </div>

      <div className="mt-12 pt-8 border-t border-slate-100">
        <button onClick={() => navigate('/')} className="w-full px-6 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98]">
          Generate Another Token
        </button>
      </div>
    </div>);
}
