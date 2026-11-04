// Iconos de Phosphor en peso light. Se importan desde /ssr para poder usarlos
// también en componentes de servidor.
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  DownloadSimple,
  EnvelopeSimple,
  GithubLogo,
  GoogleLogo,
  LinkedinLogo,
  List,
  LockSimple,
  X,
} from "@phosphor-icons/react/ssr";

type IconProps = { size?: number; className?: string };

const base = { weight: "light" as const, "aria-hidden": true };

export const GitHubIcon = ({ size = 17, className }: IconProps) => <GithubLogo size={size} className={className} {...base} />;
export const GoogleIcon = ({ size = 18, className }: IconProps) => <GoogleLogo size={size} className={className} {...base} />;
export const LinkedInIcon = ({ size = 17, className }: IconProps) => <LinkedinLogo size={size} className={className} {...base} />;
export const MailIcon = ({ size = 17, className }: IconProps) => <EnvelopeSimple size={size} className={className} {...base} />;
export const DownloadIcon = ({ size = 17, className }: IconProps) => <DownloadSimple size={size} className={className} {...base} />;
export const ExternalIcon = ({ size = 15, className }: IconProps) => <ArrowUpRight size={size} className={className} {...base} />;
export const LockIcon = ({ size = 15, className }: IconProps) => <LockSimple size={size} className={className} {...base} />;
export const MenuIcon = ({ size = 18, className }: IconProps) => <List size={size} className={className} {...base} />;
export const CloseIcon = ({ size = 18, className }: IconProps) => <X size={size} className={className} {...base} />;
export const UpIcon = ({ size = 16, className }: IconProps) => <ArrowUp size={size} className={className} {...base} />;
export const DownIcon = ({ size = 16, className }: IconProps) => <ArrowDown size={size} className={className} {...base} />;
