# VRF-Fund-widget

pre-requisites  
npm version 8.15.0  
node version 16.7.1  
do seup XDCPay Chrome Extension in your chrome  


Steps to use the widget    
Step 1:  
clone the git package to your local pc  
git clone https://github.com/GoPlugin/VRF-fund-widget.git  

Step 2:  
navigate to "VRF-fund-widget/client/" folder on cmd promt and run below command to install dependencies  
npm install  

Step 3:  
Start the widget on your local host with below command.  
npm start  

Step 4:  
Login to your XDCPaywallet.  

Step 5:  
By default mainnet PLI address "0xff7412ea7c8445c46a8254dfb557ac1e48094391" is connected to the wallet, To change please refer Tips section below.  
On your widget First Approve your VRF Co-Oridinator contract address with PLI amount. 
On your deposit screen , provide "Subscription ID" along with Co-ordinator address & PLI amount 
Then PLI entered shoul be lesser than or equal to approved amount of PLI with your VRF Co-ordinator Contract Address.  

