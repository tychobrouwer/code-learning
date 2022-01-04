import React from 'react';
import Constants from '../Constants';

const HomepageBanner = () => (
  <section
  className="homepage-banner"
  >
  <div className="banner-box">
    <h1 className="banner-title">
      {Constants.author}
    </h1>
    <h2 className="banner-description">
      {Constants.project}
    </h2>

  </div>
</section>
);

export default HomepageBanner;
