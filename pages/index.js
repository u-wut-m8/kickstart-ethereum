import React, {Component} from 'react';
import factory from '../ethereum/factory';
import {Card, Button} from 'semantic-ui-react';
import Layout from '../components/Layout';
import {Link} from '../routes';

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

  renderCampaigns () {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true
      };
    });
    return <Card.Group items={items}/>;
  }

  render () {
    return (
      <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Link route="/campaigns/new">
        <a>
        <Button
          floated="right"
          content="Create Campaign"
          icon="add circle"
          primary
        />                                 {/*Same as primary={true}*/}
        </a>
        </Link>
        {this.renderCampaigns()}
      </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
