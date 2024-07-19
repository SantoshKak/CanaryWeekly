const { test, expect } = require('@playwright/test');
const fs = require('fs');
const { chromium } = require('playwright');


const csvPath = 'C:/Users/Testriq_22/Desktop/canary_test/BonesCanary/cypress/fixtures/canaryLinks.csv';

const csvData = fs.readFileSync(csvPath, 'utf-8');
const urls = csvData.split('\n').map(url => url.trim()).filter(url => url !== '');

test('Console Logs Check', async ({ browser }) => {
    try{
        for (let url of urls) {
            try {
                const context = await browser.newContext();
                const page = await context.newPage();
    
                let consoleMessages = [];
    
                page.on('console', async msg => {
                    const args = await Promise.all(msg.args().map(arg => arg.jsonValue()));
                    consoleMessages.push(args);
                });
    
                await page.goto(url);
        
                //await page.waitForTimeout(5000);

                await page.waitForLoadState('load');
                await page.waitForLoadState('domcontentloaded');
                await page.waitForLoadState('networkidle');
    
       
    
    
    
                const hasLoadingMessage = consoleMessages.some(msg => msg.includes('Loading gmap version'));
                const hasWeeklyMessage = consoleMessages.some(msg => msg.includes('weekly'));
    
                if (hasLoadingMessage && hasWeeklyMessage) {
                    console.log("Condition met for", url);
                } else {
                    console.log("Condition not met for", url);
                }
    
                await context.close();
    
            } catch (error) {
                console.error('Error navigating to URL:', url);
          
                continue;
            }
        }
    }
    catch(error){
        console.log("Error");
    }
    
});