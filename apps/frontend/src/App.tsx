import { Card } from "@/components/primitives/Card";
import { RulesPanel } from "@/components/RulesPanel";
import { Row } from "@/components/primitives/Row";

export function App() {
  return (
    <div
      id="app"
      className="p-4 min-h-screen w-full"
      style={{ backgroundColor: "#4c3533" }}
    >
      <h2
        className="m-0 mb-2 text-lg font-semibold"
        style={{ color: "#ffb74d" }}
      >
        a
      </h2>
      <div className="grid grid-cols-[1fr_280px] gap-2 items-start h-full">
        <div className="min-h-[calc(100vh-120px)] flex flex-col gap-2">
          <Row>
            <Card>a</Card>
          </Row>
          <Row>
            <Card>
              <RulesPanel />
            </Card>

            <Card>a</Card>
          </Row>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-2 sticky top-1 self-start max-h-[calc(100vh-10px)] overflow-y-auto">
          <Card>q</Card>
        </div>
      </div>
    </div>
  );
}

export default App;
