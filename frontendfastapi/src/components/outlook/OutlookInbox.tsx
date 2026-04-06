import React, { useState, useEffect } from "react";
import { EnvelopeSimple, Star, Trash } from "phosphor-react";
import "./Inbox.css";

type Email = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  starred?: boolean;
};

const mockEmails: Email[] = [
  {
    id: "1",
    from: "alice@example.com",
    subject: "Meeting Reminder",
    preview: "Don’t forget our meeting tomorrow at 10am.",
    date: "2026-03-20",
    starred: true,
  },
  {
    id: "2",
    from: "bob@example.com",
    subject: "Invoice Attached",
    preview: "Please find the invoice attached for last month.",
    date: "2026-03-19",
  },
];

const OutlookInbox: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);

  useEffect(() => {
    // Replace with API call to Microsoft Graph or your backend
    setEmails(mockEmails);
  }, []);

  return (
    <div className="inbox-container">
      <h2><EnvelopeSimple size={22} /> Inbox</h2>
      <ul className="email-list">
        {emails.map((email) => (
          <li key={email.id} className="email-item">
            <div className="email-header">
              <span className="email-from">{email.from}</span>
              <span className="email-date">{email.date}</span>
            </div>
            <div className="email-subject">{email.subject}</div>
            <div className="email-preview">{email.preview}</div>
            <div className="email-actions">
              {email.starred && <Star size={18} weight="fill" />}
              <Trash size={18} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OutlookInbox;