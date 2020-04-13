import React from "react";
import Markdown from "markdown-it";

const md = new Markdown();

const SwaggerInfo = ({ infoJson, baseUrl }) => (
  <div className="api-info">
    <h2>
      {infoJson.title}({infoJson.version})
    </h2>
    <p>[Base URL:{baseUrl}]</p>
    <p
      dangerouslySetInnerHTML={{
        __html: md.renderInline(infoJson.description),
      }}
    />
    <p>
      <a href={infoJson.termsOfService}>Terms of service</a>
    </p>
    {/* TODO: support both email and URL here */}
    <p>
      <a href={infoJson.contact.url}>Contact the developer</a>
    </p>
    <p>
      <a href={infoJson.license.url}>{infoJson.license.name}</a>
    </p>
  </div>
);

export default SwaggerInfo;
