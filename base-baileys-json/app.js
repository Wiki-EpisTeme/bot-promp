const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')
/*------------------------------------------------------------------------------------*/


/**
 * Esto se ejeuta cunado la persona escruibe "AGENTE"
 */
const flowAgente = addKeyword("Hablar con un asesor", { sensitive: true })
  .addAnswer(
   "Estamos desviando tu conversacion a nuestro agente"
  )
  .addAction(async (ctx, {provider}) => {
    const nanoid = await import('nanoid')
    const ID_GROUP = nanoid.nanoid(5)
    const refProvider = await provider.getInstance()
    await refProvider.groupCreate(`¡Adquiere tu casa ya! soporte (${ID_GROUP})`,[
        `${ctx.from}@s.whatsapp.net`
    ])
  })
  .addAnswer('Te hemos agregado a un grupo con un asesor! Gracias')

module.exports = flowAgente;



const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'te comparto los siguientes links de interes sobre el proyecto',
            '👉 *Hablar con un asesor*',
            '👉 *OFERTAS*'
        ],
        {flowAgente}
    )

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
