
import { 
  Settings, 
  Bell,
  Shield,
  Globe,
  Key,
  Save
} from "lucide-react";

export default function AdminSettingsPage() {
  const settingsSections = [
    {
      title: "General Settings",
      icon: Settings,
      description: "Configure platform-wide settings",
      items: [
        { label: "Platform Name", value: "Prodomatix", type: "text" },
        { label: "Support Email", value: "support@prodomatix.com", type: "email" },
        { label: "Default Language", value: "English", type: "select" },
      ]
    },
    {
      title: "Security",
      icon: Shield,
      description: "Manage security and authentication settings",
      items: [
        { label: "Two-Factor Authentication", value: "Enabled", type: "toggle" },
        { label: "Session Timeout", value: "30 minutes", type: "select" },
        { label: "Password Policy", value: "Strong", type: "select" },
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      description: "Configure system notifications",
      items: [
        { label: "Email Notifications", value: "Enabled", type: "toggle" },
        { label: "Push Notifications", value: "Disabled", type: "toggle" },
        { label: "Weekly Reports", value: "Enabled", type: "toggle" },
      ]
    },
    {
      title: "Integrations",
      icon: Globe,
      description: "Manage third-party integrations",
      items: [
        { label: "Stripe", value: "Connected", type: "status" },
        { label: "Google Analytics", value: "Connected", type: "status" },
        { label: "Slack", value: "Not Connected", type: "status" },
      ]
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Settings</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage platform configuration and preferences.</p>
        </div>
        <button className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xl shadow-indigo-600/20">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-8">
        {settingsSections.map((section) => (
          <div key={section.title} className="rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
            <div className="border-b border-zinc-100 bg-zinc-50/50 px-8 py-6 dark:border-zinc-800 dark:bg-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/20">
                  <section.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{section.title}</h2>
                  <p className="text-xs text-zinc-500">{section.description}</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-6 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                  <div>
                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{item.label}</p>
                  </div>
                  <div>
                    {item.type === "status" ? (
                      <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        item.value === "Connected" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-zinc-100 text-zinc-500"
                      }`}>
                        {item.value}
                      </span>
                    ) : item.type === "toggle" ? (
                      <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                        item.value === "Enabled" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-zinc-100 text-zinc-500"
                      }`}>
                        {item.value}
                      </span>
                    ) : (
                      <p className="text-sm font-medium text-zinc-500">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* API Keys Section */}
      <div className="rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        <div className="border-b border-zinc-100 bg-zinc-50/50 px-8 py-6 dark:border-zinc-800 dark:bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/20">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">API Keys</h2>
              <p className="text-xs text-zinc-500">Manage API access credentials</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="rounded-2xl border-2 border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
            <Key className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-sm font-bold text-zinc-500">API key management coming soon</p>
            <p className="text-xs text-zinc-400 mt-1">Generate and manage API keys for integrations</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-3xl border-2 border-red-200 bg-red-50/50 overflow-hidden dark:border-red-900/20 dark:bg-red-900/10">
        <div className="border-b border-red-200 bg-red-100/50 px-8 py-6 dark:border-red-900/20 dark:bg-red-900/20">
          <h2 className="text-lg font-bold text-red-900 dark:text-red-400">Danger Zone</h2>
          <p className="text-xs text-red-600 dark:text-red-500">Irreversible actions that require caution</p>
        </div>
        <div className="p-8 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-red-200 bg-white dark:border-red-900/20 dark:bg-zinc-900">
            <div>
              <p className="text-sm font-bold text-red-900 dark:text-red-400">Clear All Cache</p>
              <p className="text-xs text-red-600 dark:text-red-500">Remove all cached data from the system</p>
            </div>
            <button className="rounded-xl bg-red-100 px-4 py-2 text-xs font-bold text-red-700 transition-all hover:bg-red-200 cursor-pointer dark:bg-red-900/20 dark:text-red-400">
              Clear Cache
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl border border-red-200 bg-white dark:border-red-900/20 dark:bg-zinc-900">
            <div>
              <p className="text-sm font-bold text-red-900 dark:text-red-400">Reset Platform</p>
              <p className="text-xs text-red-600 dark:text-red-500">Reset all settings to default values</p>
            </div>
            <button className="rounded-xl bg-red-100 px-4 py-2 text-xs font-bold text-red-700 transition-all hover:bg-red-200 cursor-pointer dark:bg-red-900/20 dark:text-red-400">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
