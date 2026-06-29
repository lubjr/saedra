"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@repo/ui/dialog";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LockIcon,
  LogOutIcon,
  MailIcon,
  SettingsIcon,
  UserIcon,
  XIcon,
} from "@repo/ui/lucide";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { useTheme } from "next-themes";
import * as React from "react";
import { toast } from "sonner";

import { logout } from "../auth/auth";
import { updateUserProfile } from "../auth/user";
import { usePreferences } from "../hooks/usePreferences";
import { AvatarUpload } from "./AvatarUpload";

export type AccountSettingsSection = "profile" | "preferences";

export type AccountSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername: string;
  currentAvatarUrl: string;
  currentEmail: string;
  onProfileUpdated: () => Promise<void>;
  initialSection?: AccountSettingsSection;
};

const Segmented = ({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; beta?: boolean }[];
  disabled?: boolean;
}) => {
  return (
    <div
      className={`inline-flex rounded-md border border-border bg-background p-0.5 ${disabled ? "opacity-50" : ""}`}
    >
      {options.map((o) => {
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => {
              return onChange(o.value);
            }}
            disabled={disabled}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
              o.value === value
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground/80"
            } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {o.label}
            {o.beta && (
              <span className="text-[9px] font-semibold uppercase tracking-wider text-brand leading-none px-1 py-0.5 rounded bg-brand-fill text-brand">
                beta
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

const Switch = ({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      onClick={() => {
        return onChange(!checked);
      }}
      disabled={disabled}
      className={`relative w-9 h-5 rounded-full transition-colors ${
        checked ? "bg-brand-solid" : "bg-muted"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${
          checked ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
};

const SettingRow = ({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between gap-5 py-3.5 border-b border-border/70 last:border-0">
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{title}</div>
        {desc && (
          <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
};

const GroupHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-1">
      {children}
    </div>
  );
};

const LogoutButton = () => {
  return (
    <button
      type="button"
      onClick={async () => {
        await logout();
        window.location.reload();
      }}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-status-error transition cursor-pointer"
    >
      <LogOutIcon className="size-4" />
      Log out
    </button>
  );
};

const SaveBar = ({
  onClose,
  onSave,
  loading,
  saveDisabled,
}: {
  onClose: () => void;
  onSave: () => void;
  loading?: boolean;
  saveDisabled?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between border-t border-border bg-background/40 px-6 py-3.5 shrink-0">
      <LogoutButton />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="brand"
          onClick={onSave}
          disabled={loading || saveDisabled}
        >
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
};

const ProfilePanel = ({
  currentUsername,
  currentAvatarUrl,
  currentEmail,
  onProfileUpdated,
  onClose,
}: {
  currentUsername: string;
  currentAvatarUrl: string;
  currentEmail: string;
  onProfileUpdated: () => Promise<void>;
  onClose: () => void;
}) => {
  const [username, setUsername] = React.useState(currentUsername);
  const [avatarUrl, setAvatarUrl] = React.useState(currentAvatarUrl);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setUsername(currentUsername);
    setAvatarUrl(currentAvatarUrl);
  }, [currentUsername, currentAvatarUrl]);

  const handleSave = async () => {
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    setLoading(true);
    try {
      await updateUserProfile(username.trim(), avatarUrl.trim());
      toast.success("Profile updated");
      await onProfileUpdated();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="px-6 pt-2 pb-6 overflow-y-auto flex-1 space-y-6">
        <div>
          <h3 className="text-base font-semibold">Profile</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Update how you appear across Saedra.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <AvatarUpload
            value={avatarUrl}
            onChange={setAvatarUrl}
            username={username}
            disabled={loading}
          />
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground truncate">
              {username || "—"}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="username"
            className="text-sm font-medium text-foreground flex items-center gap-1.5"
          >
            <UserIcon className="size-3.5 text-muted-foreground" />
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => {
              return setUsername(e.target.value);
            }}
            placeholder="Enter your username"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-foreground flex items-center gap-1.5"
          >
            <MailIcon className="size-3.5 text-muted-foreground" />
            Email
          </Label>
          <Input
            id="email"
            value={currentEmail}
            disabled
            className="text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground flex items-center gap-1.5"
          >
            <LockIcon className="size-3.5 text-muted-foreground" />
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value="placeholder"
            disabled
            className="text-muted-foreground"
          />
        </div>
      </div>

      <SaveBar onClose={onClose} onSave={handleSave} loading={loading} />
    </>
  );
};

const PreferencesPanel = ({ onClose }: { onClose: () => void }) => {
  const { prefs, save } = usePreferences();
  const { setTheme } = useTheme();
  const [local, setLocal] = React.useState(prefs);

  React.useEffect(() => {
    setLocal(prefs);
  }, [prefs]);

  const set = <K extends keyof typeof local>(k: K, v: (typeof local)[K]) => {
    setLocal((p) => {
      return { ...p, [k]: v };
    });
  };

  const handleSave = () => {
    save(local);
    setTheme(local.theme);
    toast.success("Preferences saved");
    onClose();
  };

  return (
    <>
      <div className="px-6 pt-2 pb-6 overflow-y-auto flex-1 space-y-6">
        <div>
          <h3 className="text-base font-semibold">Preferences</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Control how the Saedra dashboard looks and behaves.
          </p>
        </div>

        <div>
          <GroupHeader>Appearance</GroupHeader>
          <SettingRow
            title="Theme"
            desc="Choose how the dashboard looks. System follows your OS."
          >
            <Segmented
              value={local.theme}
              onChange={(v) => {
                return set("theme", v as typeof local.theme);
              }}
              options={[
                { value: "system", label: "System" },
                { value: "dark", label: "Dark" },
                { value: "light", label: "Light", beta: true },
              ]}
            />
          </SettingRow>
          <SettingRow
            title="Interface density"
            desc="Spacing of cards, rows and lists."
          >
            <Segmented
              value={local.density}
              onChange={(v) => {
                return set("density", v as typeof local.density);
              }}
              options={[
                { value: "comfortable", label: "Comfortable" },
                { value: "compact", label: "Compact" },
              ]}
              disabled
            />
          </SettingRow>
          <SettingRow
            title="Reduce motion"
            desc="Minimize animations and transitions."
          >
            <Switch
              checked={local.reduceMotion}
              onChange={(v) => {
                return set("reduceMotion", v);
              }}
              disabled
            />
          </SettingRow>
        </div>

        <div>
          <GroupHeader>Localization</GroupHeader>
          <SettingRow title="Language">
            <Select
              value={local.language}
              onValueChange={(v) => {
                return set("language", v as typeof local.language);
              }}
            >
              <SelectTrigger className="w-48" disabled>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow title="Time zone">
            <Select
              value={local.timezone}
              onValueChange={(v) => {
                return set("timezone", v);
              }}
            >
              <SelectTrigger className="w-48" disabled>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Sao_Paulo">
                  (GMT-3) São Paulo
                </SelectItem>
                <SelectItem value="UTC">(GMT+0) UTC</SelectItem>
                <SelectItem value="America/New_York">
                  (GMT-5) New York
                </SelectItem>
                <SelectItem value="Europe/London">(GMT+0) London</SelectItem>
                <SelectItem value="Europe/Berlin">(GMT+1) Berlin</SelectItem>
                <SelectItem value="Asia/Tokyo">(GMT+9) Tokyo</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow
            title="Timestamps"
            desc="How times are shown across the app."
          >
            <Segmented
              value={local.timestamps}
              onChange={(v) => {
                return set("timestamps", v as typeof local.timestamps);
              }}
              options={[
                { value: "relative", label: "Relative" },
                { value: "exact", label: "Exact" },
              ]}
              disabled
            />
          </SettingRow>
        </div>

        <div>
          <GroupHeader>Dashboard</GroupHeader>
          <SettingRow title="Start page" desc="Where Saedra opens after login.">
            <Select
              value={local.startPage}
              onValueChange={(v) => {
                return set("startPage", v as typeof local.startPage);
              }}
            >
              <SelectTrigger className="w-48" disabled>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="last">Last visited project</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
          <SettingRow
            title="Sort projects by"
            desc="Default order on the Home grid."
          >
            <Select
              value={local.projectSort}
              onValueChange={(v) => {
                return set("projectSort", v as typeof local.projectSort);
              }}
            >
              <SelectTrigger className="w-48" disabled>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent activity</SelectItem>
                <SelectItem value="name">Project name</SelectItem>
                <SelectItem value="health">Health score</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </div>
      </div>

      <SaveBar onClose={onClose} onSave={handleSave} />
    </>
  );
};

const ComingSoonPanel = ({
  label,
  icon: Icon,
}: {
  label: string;
  icon: React.ElementType;
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center text-center flex-1 py-16 gap-3">
        <span className="size-11 rounded-lg bg-muted text-muted-foreground grid place-items-center">
          <Icon className="size-5" />
        </span>
        <div>
          <h3 className="text-base font-semibold">{label}</h3>
          <p className="text-sm text-muted-foreground mt-1">Coming soon.</p>
        </div>
      </div>
      <div className="border-t border-border bg-background/40 px-6 py-3.5 flex items-center justify-between">
        <LogoutButton />
        <span className="text-xs text-muted-foreground">
          Nothing to save here yet
        </span>
      </div>
    </>
  );
};

const SECTIONS = [
  {
    id: "profile" as const,
    label: "Profile",
    Icon: BadgeCheckIcon,
    soon: false,
  },
  {
    id: "notifications" as const,
    label: "Notifications",
    Icon: BellIcon,
    soon: true,
  },
  {
    id: "billing" as const,
    label: "Billing",
    Icon: CreditCardIcon,
    soon: true,
  },
  {
    id: "preferences" as const,
    label: "Settings",
    Icon: SettingsIcon,
    soon: false,
  },
];

type SectionId = "profile" | "preferences" | "billing" | "notifications";

export const AccountSettingsDialog = ({
  open,
  onOpenChange,
  currentUsername,
  currentAvatarUrl,
  currentEmail,
  onProfileUpdated,
  initialSection = "profile",
}: AccountSettingsDialogProps) => {
  const [active, setActive] = React.useState<SectionId>(initialSection);

  React.useEffect(() => {
    if (open) setActive(initialSection);
  }, [open, initialSection]);

  const onClose = () => {
    return onOpenChange(false);
  };
  const initial = (currentUsername || "?").charAt(0).toUpperCase();

  const renderContent = () => {
    if (active === "profile") {
      return (
        <ProfilePanel
          currentUsername={currentUsername}
          currentAvatarUrl={currentAvatarUrl}
          currentEmail={currentEmail}
          onProfileUpdated={onProfileUpdated}
          onClose={onClose}
        />
      );
    }
    if (active === "preferences") {
      return <PreferencesPanel onClose={onClose} />;
    }
    if (active === "billing") {
      return <ComingSoonPanel label="Billing" icon={CreditCardIcon} />;
    }
    return <ComingSoonPanel label="Notifications" icon={BellIcon} />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-card border-border"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Account Settings</DialogTitle>
        <div
          className="grid grid-cols-[200px_1fr] min-h-0"
          style={{ height: "min(86vh, 500px)" }}
        >
          {/* Left rail */}
          <nav className="bg-background border-r border-border p-3 flex flex-col gap-0.5">
            <div className="flex items-center gap-2 px-2 pt-1 pb-3">
              <Avatar className="size-7 shrink-0">
                <AvatarImage src={currentAvatarUrl} alt={currentUsername} />
                <AvatarFallback className="bg-muted text-foreground/80 text-xs font-semibold">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-xs font-medium text-foreground truncate">
                  {currentUsername}
                </div>
              </div>
            </div>

            {SECTIONS.map((s) => {
              const on = s.id === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    return setActive(s.id);
                  }}
                  disabled={s.soon}
                  className={`group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-left transition w-full ${
                    on
                      ? "bg-brand-fill text-brand"
                      : s.soon
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-muted-foreground hover:bg-card hover:text-foreground cursor-pointer"
                  }`}
                >
                  <s.Icon
                    className={`size-4 shrink-0 ${on ? "text-brand" : "text-muted-foreground"}`}
                  />
                  <span className="flex-1">{s.label}</span>
                  {s.soon && (
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
                      soon
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Content */}
          <div className="flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center justify-end px-4 pt-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1.5 transition cursor-pointer"
              >
                <XIcon className="size-4" />
              </button>
            </div>
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
