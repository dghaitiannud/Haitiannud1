import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogIn, UserPlus, Mail, Lock, ArrowLeft, AlertCircle, Eye, EyeOff, MailCheck, CheckCircle2 } from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/g, "");

export function LoginPage() {
  const { t } = useTranslation();
  const { signIn, signUp, isSignedIn } = useAuth();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  
  // NOUVEAU : État pour afficher l'écran de confirmation e-mail après l'inscription
  const [signupSuccess, setSignupSuccess] = useState(false);

  // État pour forcer l'affichage de l'erreur dans le formulaire
  const [formError, setFormError] = useState<string | null>(null);

  if (isSignedIn) {
    setLocation("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    
    try {
      if (mode === "signin") {
        const result = await signIn(email, password);
        
        const errorObj = result?.error || result;
        
        if (errorObj && errorObj.message) {
          setFormError(errorObj.message);
          toast.error(errorObj.message);
        } else if (errorObj && typeof errorObj === 'string') {
          setFormError(errorObj);
        } else {
          toast.success("Demande envoyée");
          
          setTimeout(() => {
            if (!isSignedIn) {
              setFormError("Identifiants incorrects ou adresse e-mail non confirmée.");
            } else {
              setLocation("/");
            }
          }, 1000);
        }
      } else {
        const result = await signUp(email, password, displayName);
        const errorObj = result?.error || result;
        
        if (errorObj && errorObj.message) {
          setFormError(errorObj.message);
          toast.error(errorObj.message);
        } else if (result?.data?.user?.identities?.length === 0) {
          setFormError("Cet e-mail est déjà utilisé par un autre compte.");
          setMode("signin");
        } else {
          // Succès de la création de compte : on bascule vers l'écran de confirmation au lieu de rediriger
          setSignupSuccess(true);
          toast.success("Compte créé avec succès !");
        }
      }
    } catch (err: any) {
      console.error("Erreur interceptée :", err);
      const msg = err?.message || err?.error_description || "Une erreur est survenue.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background px-4 py-6 flex items-start justify-center sm:items-center">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm tracking-widest">
            HN
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">HAITIAN NUD</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {signupSuccess 
              ? "Vérification de votre compte" 
              : mode === "signin" 
                ? "Connexion simple et rapide" 
                : "Créer ton compte en quelques secondes"
            }
          </p>
        </div>

        {/* ÉCRAN APPRÈS INSCRIPTION RÉUSSIE */}
        {signupSuccess ? (
          <div className="space-y-6 text-center animate-in fade-in-50">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex flex-col items-center gap-3">
              <MailCheck className="h-12 w-12 text-emerald-500" />
              <div className="space-y-1">
                <h2 className="font-bold text-lg text-foreground">Un dernier geste !</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Un e-mail de confirmation vient d'être envoyé à <span className="font-semibold text-foreground">{email}</span>.
                </p>
              </div>
            </div>

            <div className="bg-muted/40 p-4 rounded-2xl text-left text-xs space-y-2 text-muted-foreground border border-border">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Instructions :
              </p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Ouvrez votre boîte de réception e-mail.</li>
                <li>Cliquez sur le lien de confirmation.</li>
                <li>Revenez ici et connectez-vous pour profiter de tout le contenu !</li>
              </ol>
            </div>

            <div className="space-y-2 pt-2">
              <Button 
                onClick={() => {
                  setSignupSuccess(false);
                  setMode("signin");
                  setFormError(null);
                }} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <LogIn className="h-4 w-4 mr-2" /> Aller à la page de connexion
              </Button>

              <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="w-full text-muted-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" /> {t('watch.back_home')}
              </Button>
            </div>
          </div>
        ) : (
          /* FORMULAIRE CLASSIQUE CONNEXION / INSCRIPTION */
          <>
            <div className="flex gap-2 mb-6">
              <Button
                type="button"
                variant={mode === "signin" ? "default" : "outline"}
                className="flex-1"
                onClick={() => { setMode("signin"); setFormError(null); }}
              >
                <LogIn className="h-4 w-4 mr-2" />{t('nav.login')}
              </Button>
              <Button
                type="button"
                variant={mode === "signup" ? "default" : "outline"}
                className="flex-1"
                onClick={() => { setMode("signup"); setFormError(null); }}
              >
                <UserPlus className="h-4 w-4 mr-2" /> Inscription
              </Button>
            </div>

            {/* Bloc d'erreur visuel */}
            {formError && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in-50">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">{t('common.error')} : </span>
                  {formError === "User already registered" ? "Cet e-mail possède déjà un compte." : formError}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.username')}</Label>
                  <Input
                    id="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ton pseudo"
                    required={mode === "signup"}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t('account.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {loading ? "Chargement..." : mode === "signin" ? "Se connecter" : "Créer mon compte"}
              </Button>
            </form>

            <div className="mt-6 space-y-2">
              {mode === "signin" && (
                <div className="text-center">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setLocation("/forgot-password")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Mot de passe oublié ?
                  </Button>
                </div>
              )}
              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="text-muted-foreground">
                  <ArrowLeft className="h-4 w-4 mr-2" />{t('watch.back_home')}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}