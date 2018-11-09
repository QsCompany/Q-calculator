@echo off
echo ********************** Download Q-Calculator App  ***********************************
git clone https://github.com/QsCompany/Q-calculator.git
cd Q-calculator
echo **********************   Install Http-Server      ***********************************
npm install http-server -g
echo *********************        Start App            ***********************************
start http://127.0.0.1:80
http-server -p 80