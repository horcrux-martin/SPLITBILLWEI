import { useMemo, useState } from "react";
import ScanPage from "./pages/ScanPage";
import EditPage from "./pages/EditPage";
import ResultPage from "./pages/ResultPage";
import type { ScanResult, BillState, BillResult } from "./utils/types";

type Route = "scan" | "edit" | "result";

export default function App() {
  const [route, setRoute] = useState<Route>("scan");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [billState, setBillState] = useState<BillState | null>(null);
  const [billResult, setBillResult] = useState<BillResult | null>(null);

  const page = useMemo(() => {
    if (route === "scan") {
      return (
        <ScanPage
          onDone={(res) => {
            setScanResult(res);
            setRoute("edit");
          }}
        />
      );
    }
    if (route === "edit") {
      return (
        <EditPage
          scanResult={scanResult}
          onBack={() => setRoute("scan")}
          onDone={(state, result) => {
            setBillState(state);
            setBillResult(result);
            setRoute("result");
          }}
        />
      );
    }
    return (
      <ResultPage
        billState={billState}
        billResult={billResult}
        onRestart={() => {
          setScanResult(null);
          setBillState(null);
          setBillResult(null);
          setRoute("scan");
        }}
      />
    );
  }, [route, scanResult, billState, billResult]);

  return <div className="app">{page}</div>;
}
