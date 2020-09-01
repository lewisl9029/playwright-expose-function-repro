import playwright from 'playwright'

(async () => {
    const browser = await playwright.chromium.launch({ headless: false })
    const page = await browser.newPage()

    page.exposeFunction('testExposeFunction', async (element) => {
        // this logs an empty object {} in node
        console.log(element)
        // this throws with "element.screenshot is not a function" in page
        await element.screenshot({ path: 'test.png' })
    })

    page.exposeFunction('testExposeFunctionAlternative', async (selector) => {
        console.log(selector)
        const element = await page.$(selector)
        // this works great
        await element.screenshot({ path: 'testAlternative.png' })
    })

    page.evaluate(() => {
        const div = document.createElement('div')
        div.innerText = "test"
        div.id = "test"
        document.body.appendChild(div)
        
        window.testExposeFunction(div)
        window.testExposeFunctionAlternative("#test")
    })
})()