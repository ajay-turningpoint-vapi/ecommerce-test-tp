import { useState } from 'react';
import { adminSettings } from '@/data/adminMockData';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [settings, setSettings] = useState({ ...adminSettings });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        {/* Shipping */}
        <div>
          <h3 className="font-semibold mb-3">Shipping Charges</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Shipping Charge (₹)</label>
              <input type="number" value={settings.shippingCharge} onChange={e => setSettings({ ...settings, shippingCharge: Number(e.target.value) })}
                className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Free Shipping Above (₹)</label>
              <input type="number" value={settings.freeShippingAbove} onChange={e => setSettings({ ...settings, freeShippingAbove: Number(e.target.value) })}
                className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* Tax */}
        <div>
          <h3 className="font-semibold mb-3">Tax (GST)</h3>
          <div>
            <label className="text-sm font-medium">GST Percentage (%)</label>
            <input type="number" value={settings.gstPercent} onChange={e => setSettings({ ...settings, gstPercent: Number(e.target.value) })}
              className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm max-w-xs" />
          </div>
        </div>

        <hr className="border-border" />

        {/* Return Window */}
        <div>
          <h3 className="font-semibold mb-3">Return Policy</h3>
          <div>
            <label className="text-sm font-medium">Return Window (Days)</label>
            <input type="number" value={settings.returnWindowDays} onChange={e => setSettings({ ...settings, returnWindowDays: Number(e.target.value) })}
              className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm max-w-xs" />
          </div>
        </div>

        <hr className="border-border" />

        {/* COD */}
        <div>
          <h3 className="font-semibold mb-3">Cash on Delivery</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={settings.codEnabled} onChange={e => setSettings({ ...settings, codEnabled: e.target.checked })} />
              Enable COD
            </label>
            <div>
              <label className="text-sm font-medium">COD Limit (₹)</label>
              <input type="number" value={settings.codLimit} onChange={e => setSettings({ ...settings, codLimit: Number(e.target.value) })}
                className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
