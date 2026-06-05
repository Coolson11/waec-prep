export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Settings</h1>
      <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">System Configuration</h2>
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Maintenance Mode</label>
          <input type="checkbox" className="h-5 w-5 rounded border-slate-300" />
          <button className="block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">Save Settings</button>
        </div>
      </div>
    </div>
  );
}
