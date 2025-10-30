import { Card } from "@/components/primitives/Card";
import { Row } from "@/components/primitives/Row";
import { RulesPanel } from "@/components/RulesPanel";

export default function Home() {
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
      <div className="grid gap-2 items-start h-full">
        <div className="flex flex-col gap-2">
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
      </div>
    </div>
  );
}
