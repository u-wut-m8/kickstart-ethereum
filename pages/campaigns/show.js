import React, {Component} from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import {Card, Grid, Button} from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import {Link} from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps (props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();
    return {
      address: props.query.address, //Return address as well because others function aren't aware of props.query from getInitialProps().
      minimun_contribution: summary[0],
      balance: summary[1],
      requests_count: summary[2],
      approvers_count: summary[3],
      manager: summary[4]
    };
  }

  renderCards () {
    const {
      balance,
      minimun_contribution,
      requests_count,
      approvers_count,
      manager
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description: "The manager created this campaign and can create requests for the same.",
        style: {overflowWrap: "break-word"}
      },{
        header: minimun_contribution,
        meta: "Minimum Contribution (wei)",
        description: "You must contribute at least this much wei to become an approver"
      },{
        header: requests_count,
        meta: "Number of Requests",
        description: "A request tries to withdraw money from the contract. Requests must be approved by approvers"
      },{
        header: approvers_count,
        meta: "Number of Approvers",
        description: "Number of people who have already donated to this campaign"
      },{
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description: "Amount of money this campaign has left to spend"
      }
    ];

    return <Card.Group items={items}/>;
  }

  render () {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        <Grid>
        <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
            </Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button secondary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
