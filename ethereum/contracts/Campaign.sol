pragma solidity ^0.4.17;

contract Factory {
    address[] public deployed_campaigns;

    function createCampaign(uint minimum) public {
        address new_campaign = new Campaign(minimum, msg.sender);
        deployed_campaigns.push(new_campaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployed_campaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimun_contribution;
    mapping(address => bool) public contributors;
    uint public no_of_contributors;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimun_contribution = minimum;
        no_of_contributors = 0;
    }

    function contribute() public payable {
        require(msg.value > minimun_contribution);
        contributors[msg.sender] = true;
        no_of_contributors++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        Request memory newRequest = Request({                                                               //Same as Request(description, value, recipient, false); which should be avoided.
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
            //approvals needn't be initialized because reference types don't need to initialized when creating structure variable in solidity.
        });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(contributors[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(request.approvalCount > (no_of_contributors/2));
        require(!request.complete);
        request.recipient.transfer(request.value);
        request.complete = true;
    }
}
