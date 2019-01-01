import React, {Component} from 'react';
import factory from '../ethereum/factory';

class CampaignIndex extends Component {
  /*getInitialProps() is a Nextjs specific function which is static to reduce processing cost caused by rendering.
    getInitialProps() is called by Nextjs if present in a component before the component is deployed.*/
    static async getInitialProps () {
      const campaigns = await factory.methods.getDeployedCampaigns().call();
      return {campaigns};                           //return to this component as props.
    }

  /*Don't use componentDidMount() because during server side rendering by Nextjs
   no component would have been deployed as it renders on server side.*/
  // async componentDidMount() {
  //   const campaigns = await factory.methods.getDeployedCampaigns().call();
  //   console.log(campaigns);
  // }

  render () {
    return <div>{this.props.campaigns[0]}</div>;
  }
}

export default CampaignIndex;
