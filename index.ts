import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import _ from 'lodash';

interface ITestCase {
    inputs: Array<ChatCompletionMessageParam>;
    expected: IResult;
}

interface IResult {
    type: 'plan' | 'message';
}

const OPENAI_API_KEY = ""

const TEST_COUNT = 5;

// const PROMPT = 'You analyze a text and classify it as either a "plan" or a "message." You return the result as a JSON object in the following format:  \n`{ "type": "message" | "plan" }`';

const PROMPT = ""

const TESTS: Array<ITestCase> = [
    {
        inputs: [{
            role: 'user',
            content: `O que o lead deve fazer em seguida? Por favor, pergunte ao Vitor qual o tipo de rede elétrica que ele possui (monofásica, bifásica, trifásica...).
Qual é o tipo de rede elétrica que você tem, Vitor? Monofásica, bifásica ou trifásica?`
        }],
        expected: { type: 'plan' }
    }, {
        inputs: [{
            role: 'user',
            content: `De nada, Vitor! Se precisar de algo mais, estou por aqui. 😊
O planejamento está completo, agora devo responder o lead`
        }],
        expected: { type: 'plan' }
    }, {
        inputs: [{
            role: 'user',
            content: `Completei o passo a passo do atendimento, vou seguir com o próximo lead
Estou aqui para ajudar com qualquer dúvida que você tiver! 😊
Ótimo, se precisar de mais alguma coisa, fico à disposição. Boa tarde! 😊`
        }],
        expected: { type: 'plan' }
    }, {
        inputs: [{
            role: 'user',
            content: `Passo 1: O que já foi realizado no atendimento? 
- O lead respondeu à saudação e está participando da conversa.
Passo 2: O que falta realizar?
- Ainda preciso me apresentar como Lívia.
- Perguntar o nome do lead.
- Identificar as necessidades do lead em relação a exercícios físicos para continuar a conversa.
Passo 3: O que fazer a seguir?
Me apresentar como Lívia e perguntar o nome do lead para iniciar a identificação das suas necessidades.`
        }],
        expected: { type: 'plan' }
    }, {
        inputs: [{
            role: 'user',
            content: `[ETAPA DE FEEDBACK]
Vou aguardar o feedback do cliente! 😊`
        }],
        expected: { type: 'plan' }
    }, {
        inputs: [{
            role: 'user',
            content: `Passo 1: O que já foi realizado no atendimento? 
- O lead respondeu à saudação e está participando da conversa.`
        }],
        expected: { type: 'plan' }
    }, {
        inputs: [{
            role: 'user',
            content: `Oi 😊
Prazer Lead! Sou Lívia, consultora de vendas da SK Plásticos.
Como posso te ajudar hoje?`
        }],
        expected: { type: 'plan' }
    }, {
        inputs: [{
            role: 'user',
            content: `A Caixa Plástica ALC é um modelo com tampa bipartida, ideal para flexibilidade de uso. Vou enviar os detalhes do produto.
Confira e me diga se essa opção atende às suas necessidades. 😊`
        }],
        expected: { type: 'message' }
    }, {
        inputs: [{
            role: 'user',
            content: `Infelizmente, neste momento não temos uma caixa plástica fechada com tampa e 30 cm de altura disponível em nosso catálogo.
Gostaria de verificar outro produto ou analisar outras especificações?`
        }],
        expected: { type: 'message' }
    }, {
        inputs: [{
            role: 'user',
            content: `Tainara, não encontrei registros do modelo "Caixa Plástica ALC 64365" específico, mas temos outras opções dobráveis que podem interessar, como as caixas PS6423, PS6412 e PS6418.
Gostaria de saber se deseja explorar essas alternativas?`
        }],
        expected: { type: 'message' }
    }, {
        inputs: [{
            role: 'user',
            content: `Bom dia, Vitor! 😊
O motivo da nossa conversa é que precisamos de algumas informações para que nosso especialista possa realizar um orçamento para você.
Poderia me contar um pouco sobre suas necessidades em relação à energia solar?`
        }],
        expected: { type: 'message' }
    }, {
        inputs: [{
            role: 'user',
            content: `Obrigado por enviar a conta, Vitor. Agora, só precisamos de uma foto do disjuntor externo, aquele que fica ao lado do medidor, na caixinha externa. Isso nos ajudará no orçamento! 😊
O orçamento está quase pronto!
Para finalizar, preciso de uma foto do disjuntor externo. É só ele que está faltando. 😊
Depois disso, nosso especialista fará o orçamento, e entraremos em contato assim que estiver pronto. Se tiver outras perguntas, estou à disposição!`
        }],
        expected: { type: 'message' }
    }, {
        inputs: [{
            role: 'user',
            content: `Vítor, já identifiquei que sua rede elétrica é bifásica, sua concessionária é a Certel Energia e seu endereço está registrado como Rua Leonida Poersch, 204, Centro, São Pedro da Serra.
Você pretende aumentar o consumo de energia, como adicionar novos aparelhos? E gostaria de compensar energia para outra residência?
Vítor, você pretende aumentar o consumo de energia, por exemplo, com a compra de novos aparelhos, como um ar-condicionado? E gostaria de compensar energia para outra residência?`
        }],
        expected: { type: 'message' }
    }, {
        inputs: [{
            role: 'user',
            content: `Geral do, só para confirmar:

Seu pedido até agora é 15 cestas de supermercado, cor vermelha.

Papéis para presente não trabalhamos, apenas produtos plásticos.

Deseja adicionar mais algum item do nosso portfólio ou seguimos assim?

Por favor, confirme os dados do pedido para prosseguirmos.`
        }],
        expected: { type: 'message' }
    },
];

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

/**
 * Public Domain/MIT  
 * Generates a UUIDV4
 */
export function generateUUIDV4() {
    let
        d = new Date().getTime(),
        d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
};

/**
 * Generetas an alphanumerical UUID with custom length and no " - "s 
 * @param length Defaults to 16.
 */
export function generateSimpleUUID(length: number = 16) {
    return generateUUIDV4().replace(/-/g, '').substring(0, length);
}

async function getCompletion(test: Array<ChatCompletionMessageParam>): Promise<IResult> {
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: generateSimpleUUID(8) + ' ' + PROMPT },
            ...test
        ],
        response_format: { type: 'json_object' },
        n: 1,
    });

    // @ts-expect-error
    return JSON.parse(completion.choices[0].message.content);
}

const results: Array<{ success: number, failures: number, successRate: number }> = [];

(async () => {
    await Promise.all(TESTS.map(async (t, i) => {

        if (!results[i]) results[i] = {
            failures: 0,
            success: 0,
            successRate: 0,
        };

        for (let j = 0; j < TEST_COUNT; j++) {
            const completion = await getCompletion(t.inputs);

            console.log(completion, t.expected)

            const equal = _.isEqual(completion, t.expected);

            results[i][equal ? 'success' : 'failures']++;
        }

        const successRate = results[i].success / (results[i].failures + results[i].success);
        results[i].successRate = successRate;
    }));

    console.log(results)

    const totalFailures = results.reduce((pv, cur, i) => pv + cur.failures, 0);
    const totalSuccess = results.reduce((pv, cur, i) => pv + cur.success, 0);

    const totalSuccessRate = totalSuccess / (totalFailures + totalSuccess);

    console.log('totalSuccessRate', totalSuccessRate)

})();


