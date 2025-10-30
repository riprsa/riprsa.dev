import { Button } from "@/components/primitives/Button";

export function RulesPanel() {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-amber-100">Rules</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-xs table-fixed border-collapse">
          <thead>
            <tr className="whitespace-nowrap min-h-6 border-b border-dashed border-amber-800 font-semibold">
              <th className="text-left px-2 py-1 text-amber-200">Rule Name</th>
              <th className="text-left px-2 py-1 text-amber-200">Condition</th>
              <th className="text-left px-2 py-1 text-amber-200">Action</th>
              <th className="text-left px-2 py-1 text-amber-200">Status</th>
              <th className="text-left px-2 py-1 text-amber-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="whitespace-nowrap min-h-6 border-b border-amber-800/40 transition-colors hover:bg-white/3">
              <td
                colSpan={5}
                className="text-center px-2 py-8 italic text-amber-300"
              >
                No rules configured
              </td>
            </tr>
          </tbody>
        </table>
        <Button label="Add New Rule" variant="primary" size="medium" />
      </div>
    </>
  );
}


