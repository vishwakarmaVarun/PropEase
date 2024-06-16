import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landLord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        if (!res.ok) {
          throw new Error("Failed to fetch the landlort data.");
        }
        const data = await res.json();
        setLandLord(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchLandLord();
  }, [listing.userRef]);

  const handleChnage = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landLord && (
        <div>
          <p>
            Contact <span className="font-medium">{landLord.username}</span> for{" "}
            <span className="font-medium">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full mt-2 mb-5 border p-3 rounded-lg resize-none"
            onChange={handleChnage}
            placeholder="Enter your message"
            name="message"
            id="message"
            rows={2}
            value={message}
          ></textarea>
          <Link
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
            to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
