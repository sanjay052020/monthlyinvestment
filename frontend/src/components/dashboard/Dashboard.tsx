import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AddInvestmentForm from "./AddInvestmentForm";
import InvestmentTable from "./InvestmentTable";
import ReportGenerator from "../reportgenerate/ReportGenerator";
import Home from "../home/Home";

const Dashboard: React.FC = () => {
  const [activeContent, setActiveContent] = useState<string>("Home");
  const showBackground = activeContent !== "Home";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh", // ✅ ensures full page coverage
        width: "100%",      // ✅ covers full width
        backgroundImage: showBackground
          ? "url('/images/Monthlyexpensesbac.png')"
          : "none",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // ✅ keeps image fixed while scrolling
      }}
    >
      {/* Sidebar */}
      <Sidebar setActiveContent={setActiveContent} />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "2rem",
          borderRadius: "8px",
          margin: "1rem",
          overflowY: "auto",
        }}
      >
        {activeContent === "Home" && <Home />}
        {activeContent === "EnterExpenses" && <AddInvestmentForm />}
        {activeContent === "ViewMonthly" && <InvestmentTable />}
        {activeContent === "ViewYearly" && <h2>📊 Yearly Expenses Report</h2>}
        {activeContent === "ReportGenerate" && <ReportGenerator />}
        {activeContent === "Projects" && <h2>📂 Projects Section</h2>}
        {activeContent === "Tasks" && <h2>✅ Tasks Section</h2>}
        {activeContent === "Settings" && <h2>⚙️ Settings Overview</h2>}
        {activeContent === "Messages" && <h2>💬 Messages Section</h2>}
        {activeContent === "Updates" && <h2>🔔 Updates Section</h2>}
        {activeContent === "Support" && <h2>🛟 Support Section</h2>}
      </main>
    </div>
  );
};

export default Dashboard;