import Document, { Html, Main, NextScript, DocumentContext } from 'next/document'
// import getConfig from 'next/config';
export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }
    render() {
        // const contextPath = getConfig().publicRuntimeConfig.contextPath;
        return (
            <Html>
                {/* <Head>
                    <link id="theme-link" href={`${contextPath}/themes/lara-dark-indigo/theme.css`} rel="stylesheet"></link>
                </Head> */}
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}