const {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
} = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const delay = (ms) => new Promise((res) => setTimeout(res, ms))

const flowAgente = addKeyword("Hablar con un asesor", { sensitive: true })
    .addAnswer(
        "Estamos desviando tu conversacion a nuestro agente"
    )
    .addAction(async (ctx, { provider }) => {
        const nanoid = await import('nanoid')
        const ID_GROUP = nanoid.nanoid(5)
        const refProvider = await provider.getInstance()
        await refProvider.groupCreate(`Media Tech Support (${ID_GROUP})`, [
            `${ctx.from}@s.whatsapp.net`
        ])
    })
    .addAnswer('Te hemos agregado a un grupo con un asesor! Gracias')

module.exports = flowAgente;

const flujosInformacion = addKeyword([1])
    .addAnswer('En este texto te doy informacion sobre el chatbot-3.0',

        {
            buttons: [
                {
                    body: 'Casa 1'
                },
                {
                    body: 'Casa 2'
                },
                {
                    body: 'casa 3'
                },
                {
                    body: 'Edificos'
                },
                {
                    body: 'Locales'
                },
                {
                    body: 'Almacenes'
                }
            ]
        }
    )
    .addAnswer('Hablar con un asesor',
        [
            flowAgente
        ])


const flujosDocumentacion = addKeyword([2])
    .addAnswer('En este texto te doy documentacion sobre el chatbot-3.0')

const conversacionPrincipal = addKeyword(['chatbot-3.0', 'hola', 'h'])
    .addAnswer('Bienvenido a Yinketing')
    .addAnswer(
        '*1.* para mas informacion',
        '*2.* para leer la documentacion',
        null,
        [flujosDocumentacion, flujosInformacion]
    )


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([conversacionPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()