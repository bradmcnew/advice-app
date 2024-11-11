// SocialMediaLinks.js
import React from "react";

const SocialMediaLinks = ({ links, onChange }) => (
  <div>
    <h3>Social Media Links</h3>
    {Object.keys(links).map((link) => (
      <input
        key={link}
        type="text"
        name={link}
        value={links[link]}
        onChange={(e) => onChange(e)}
        placeholder={`${link.charAt(0).toUpperCase() + link.slice(1)} URL`}
      />
    ))}
  </div>
);

export default SocialMediaLinks;
