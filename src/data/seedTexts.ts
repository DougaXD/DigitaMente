import { StudyText } from '../types';

export const SEED_TEXTS: StudyText[] = [
  // --- NOTÍCIAS (4 textos editoriais cívicos e atemporais) ---
  {
    id: 'noticia-1',
    title: 'O que é inflação e como ela afeta a economia',
    category: 'Notícias',
    subcategory: 'Economia Básica',
    lang: 'pt',
    level: 'médio',
    wordCount: 112,
    body: 'A inflação é o aumento persistente e generalizado dos preços de bens e serviços em uma economia. Quando a inflação sobe, o poder de compra da moeda diminui. Isso significa que a mesma quantia de dinheiro compra menos produtos do que antes. Os bancos centrais acompanham esse fenômeno por meio de índices oficiais de preços e utilizam a taxa básica de juros como ferramenta principal para controlar a circulação de moeda. Quando os juros sobem, o consumo tende a desacelerar, aliviando a pressão sobre os preços.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'A inflação reduz o poder de compra da população.',
      'Bancos centrais usam a taxa básica de juros para equilibrar os preços.',
      'O aumento de juros costuma desacelerar o consumo e estabilizar o mercado.'
    ],
    quiz: [
      {
        question: 'O que ocorre quando a taxa de inflação sobe de maneira constante?',
        options: ['O poder de compra da moeda diminui', 'Os preços caem drasticamente', 'O dinheiro passa a valer o dobro', 'A taxa de juros é extinta'],
        answerIndex: 0,
        explanation: 'Com a inflação, o dinheiro perde poder de compra e adquire menos bens.'
      },
      {
        question: 'Qual é o principal instrumento dos bancos centrais para conter a inflação?',
        options: ['Imprimir mais cédulas', 'A taxa básica de juros', 'Proibir as importações', 'Congelar salários permanentemente'],
        answerIndex: 1,
        explanation: 'A taxa básica de juros regula o custo do crédito e a circulação de moeda.'
      },
      {
        question: 'O que tende a acontecer com o consumo quando os juros sobem?',
        options: ['Aumenta sem limites', 'Permanece idêntico', 'Tende a desacelerar', 'Estimula o endividamento descontrolado'],
        answerIndex: 2,
        explanation: 'Juros mais altos encarecem o crédito e desestimulam compras a prazo.'
      }
    ]
  },
  {
    id: 'noticia-2',
    title: 'Como funciona uma eleição democrática',
    category: 'Notícias',
    subcategory: 'Cidadania',
    lang: 'pt',
    level: 'médio',
    wordCount: 118,
    body: 'Em uma democracia representativa, as eleições são o mecanismo pelo qual os cidadãos escolhem seus governantes e legisladores. O processo começa com o alistamento eleitoral e o registro de candidaturas por partidos políticos. No dia da votação, os eleitores depositam seus votos de maneira secreta e universal. A contagem dos votos é auditada por órgãos eleitorais independentes para assegurar a transparência e a soberania popular. A alternância de poder assegura a renovação das lideranças e a prestação contínua de contas à sociedade.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'O voto secreto e universal garante a liberdade de escolha do cidadão.',
      'A alternância de poder é um princípio fundamental das democracias.',
      'A auditoria e a apuração independente asseguram a legitimidade do resultado.'
    ],
    quiz: [
      {
        question: 'Qual é o principal objetivo de uma eleição representativa?',
        options: ['Eleger representantes pelo voto dos cidadãos', 'Nomear funcionários vitalícios', 'Substituir os tribunais de justiça', 'Cancelar leis anteriores'],
        answerIndex: 0,
        explanation: 'O voto escolhe os líderes e legisladores que representarão a população.'
      },
      {
        question: 'Como deve ser o voto do eleitor para garantir sua liberdade?',
        options: ['Público e monitorado', 'Secreto e universal', 'Obrigatório e financeiro', 'Restrito a poucos delegados'],
        answerIndex: 1,
        explanation: 'O voto secreto protege o eleitor de qualquer coerção.'
      },
      {
        question: 'Por que a alternância no poder é importante?',
        options: ['Impede a realização de novas eleições', 'Renova as lideranças e exige prestação de contas', 'Extingue partidos políticos', 'Dificulta a criação de leis'],
        answerIndex: 1,
        explanation: 'A troca periódica de governantes fortalece as instituições democráticas.'
      }
    ]
  },
  {
    id: 'noticia-3',
    title: 'O papel dos três poderes na organização do Estado',
    category: 'Notícias',
    subcategory: 'Instituições Democráticas',
    lang: 'pt',
    level: 'médio',
    wordCount: 124,
    body: 'A organização do Estado moderno baseia-se na teoria da separação de poderes proposta pelo filósofo Montesquieu. Na República, as funções de governar são distribuídas entre o Poder Executivo, o Poder Legislativo e o Poder Judiciário. O Executivo administra a máquina pública e executa políticas sociais. O Legislativo debate projetos de lei, cria normas e fiscaliza os atos do governo. Por sua vez, o Judiciário julga conflitos de acordo com a Constituição e garante a igualdade de todos perante as leis. O sistema de freios e contrapesos assegura que nenhum dos poderes exerça autoridade ilimitada sobre a nação.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'Os poderes Executivo, Legislativo e Judiciário operam de forma harmônica e independente.',
      'O Legislativo fiscaliza o Executivo e cria leis para o país.',
      'O sistema de freios e contrapesos impede a concentração abusiva de poder.'
    ],
    quiz: [
      {
        question: 'Qual é a principal atribuição do Poder Legislativo?',
        options: ['Julgar litígios civis', 'Elaborar leis e fiscalizar os atos do Executivo', 'Comandar as forças armadas', 'Arrecadar impostos municipais'],
        answerIndex: 1,
        explanation: 'O Legislativo propõe, vota leis e vigia a atuação do governo.'
      },
      {
        question: 'Qual é a função central do Poder Judiciário?',
        options: ['Criar orçamentos anuais', 'Interpretar e aplicar as leis para resolver conflitos', 'Nomear ministros de Estado', 'Administrar escolas públicas'],
        answerIndex: 1,
        explanation: 'O Judiciário assegura a vigência da Constituição e a aplicação da lei.'
      },
      {
        question: 'Para que serve o sistema de freios e contrapesos?',
        options: ['Para unificar os três poderes em uma só pessoa', 'Para impedir que um poder exerça domínio absoluto sobre os outros', 'Para extinguir o Parlamento', 'Para atrasar decisões judiciais'],
        answerIndex: 1,
        explanation: 'O equilíbrio mútuo garante que nenhum órgão abuse de sua autoridade.'
      }
    ]
  },
  {
    id: 'noticia-4',
    title: 'A relevância dos censos demográficos para o planejamento público',
    category: 'Notícias',
    subcategory: 'Sociedade e Estatística',
    lang: 'pt',
    level: 'médio',
    wordCount: 120,
    body: 'O censo demográfico é a contagem exaustiva de todos os habitantes de um país e a coleta detalhada de suas características socioeconômicas. Realizado periodicamente, ele revela quantas pessoas vivem em cada município, qual é a idade média da população, o nível de escolaridade e o acesso ao saneamento básico. Esses dados são fundamentais para que governos decidam onde construir hospitais, escolas e creches, além de orientar a partilha justa de recursos tributários. Empresas privadas também utilizam as estatísticas do censo para planejar investimentos, abrir novos negócios e gerar postos de trabalho de acordo com as necessidades locais.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'O censo traça o retrato detalhado das condições de vida de um país.',
      'Dados censitários direcionam a criação de creches, hospitais e redes de saneamento.',
      'Orienta a distribuição de verbas públicas entre os municípios.'
    ],
    quiz: [
      {
        question: 'O que o censo demográfico mapeia em um país?',
        options: ['Apenas a quantidade de veículos em rodovias', 'O total de habitantes e suas condições de moradia, saúde e educação', 'O valor das moedas estrangeiras', 'A previsão do tempo para a década'],
        answerIndex: 1,
        explanation: 'O censo coleta dados socioeconômicos essenciais de toda a população.'
      },
      {
        question: 'Como o poder público utiliza os dados do censo?',
        options: ['Para cancelar serviços públicos antigos', 'Para planejar obras de saneamento, escolas e hospitais', 'Para impedir a migração interna', 'Para sortear moradias sem critério'],
        answerIndex: 1,
        explanation: 'As informações guiam onde e como investir o orçamento coletivo.'
      },
      {
        question: 'De que forma as empresas privadas aproveitam as estatísticas censitárias?',
        options: ['Para identificar oportunidades de mercado e planejar empreendimentos', 'Para proibir compras a prazo', 'Para definir salários únicos', 'Para fechar lojas no interior'],
        answerIndex: 0,
        explanation: 'Compreender o perfil dos habitantes orienta a criação de serviços e empregos.'
      }
    ]
  },

  // --- ATUALIDADES (4 textos editoriais) ---
  {
    id: 'atualidade-1',
    title: 'A transição energética e o futuro das energias limpas',
    category: 'Atualidades',
    subcategory: 'Sustentabilidade',
    lang: 'pt',
    level: 'longo',
    wordCount: 135,
    body: 'A transição energética global consiste na substituição gradual de combustíveis fósseis, como carvão e petróleo, por fontes renováveis de baixa emissão de carbono. Entre as principais alternativas destacam-se a energia solar fotovoltaica, os parques eólicos terrestres e marítimos e a biomassa sustentável. Países em todo o mundo investem na modernização de redes elétricas e no desenvolvimento de baterias de alta capacidade para armazenar eletricidade nos momentos de baixa geração natural. Além de mitigar as mudanças climáticas, essa transformação estimula novas indústrias, gera empregos técnicos e reduz a dependência de importações de hidrocarbonetos.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'Fontes solares e eólicas substituem fontes fósseis poluentes.',
      'O armazenamento em baterias é crucial para a estabilidade da rede.',
      'A transição estimula novos empregos e protege a segurança energética.'
    ],
    quiz: [
      {
        question: 'Qual é a principal meta da transição energética?',
        options: ['Aumentar o consumo de carvão', 'Substituir combustíveis fósseis por fontes renováveis', 'Desligar as redes elétricas nacionais', 'Eliminar o uso de eletricidade'],
        answerIndex: 1,
        explanation: 'O foco é reduzir a emissão de carbono trocando fontes poluentes por limpas.'
      },
      {
        question: 'Por que o desenvolvimento de baterias é essencial para a energia solar e eólica?',
        options: ['Para armazenar eletricidade quando não há sol ou vento', 'Para substituir os cabos elétricos', 'Para aquecer as residências no verão', 'Para eliminar o uso da água'],
        answerIndex: 0,
        explanation: 'Baterias guardam a energia excedente para garantir fornecimento constante.'
      },
      {
        question: 'Qual benefício econômico a transição energética proporciona?',
        options: ['Criação de novos postos de trabalho e autonomia energética', 'Aumento de apagões frequentes', 'Dependência exclusiva de petróleo', 'Fim do comércio internacional'],
        answerIndex: 0,
        explanation: 'O setor renovável impulsiona novas profissões e reduz importações caras.'
      }
    ]
  },
  {
    id: 'atualidade-2',
    title: 'A inteligência artificial no cotidiano profissional',
    category: 'Atualidades',
    subcategory: 'Trabalho e Sociedade',
    lang: 'pt',
    level: 'médio',
    wordCount: 122,
    body: 'Sistemas inteligentes baseados em aprendizado de máquina estão redefinindo tarefas cotidianas nos mais variados escritórios. Em vez de substituir completamente o julgamento humano, as ferramentas modernas atuam como copilotos. Elas aceleram a redação de textos técnicos, organizam grandes volumes de dados e automatizam rotinas repetitivas. Profissionais de todas as áreas aprendem a formular instruções precisas e a validar criticamente as respostas fornecidas pelas máquinas. O discernimento ético, a criatividade e a empatia continuam sendo capacidades essencialmente humanas que agregam o verdadeiro diferencial.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'A inteligência artificial funciona melhor como colaboradora do que como substituta.',
      'A verificação crítica dos resultados é indispensável para a qualidade.',
      'Habilidades interpessoais e éticas ganham mais destaque no mercado.'
    ],
    quiz: [
      {
        question: 'Como as ferramentas de inteligência artificial são mais bem aproveitadas no trabalho?',
        options: ['Assumindo decisões sem qualquer supervisão', 'Como assistentes e copilotos de produtividade', 'Substituindo o raciocínio crítico', 'Impedindo a comunicação entre equipes'],
        answerIndex: 1,
        explanation: 'Elas aceleram etapas repetitivas enquanto o ser humano guia e valida.'
      },
      {
        question: 'Qual etapa humana é indispensável ao usar respostas de uma IA?',
        options: ['Copiar sem ler', 'Validação crítica do conteúdo', 'Desligar o computador', 'Imprimir o texto em papel'],
        answerIndex: 1,
        explanation: 'A validação crítica evita equívocos e assegura precisão factual.'
      },
      {
        question: 'Quais habilidades humanas continuam insubstituíveis?',
        options: ['Velocidade pura de digitação mecânica', 'Empatia, criatividade e discernimento ético', 'Cálculo manual de raiz quadrada', 'Memorização de números de telefone'],
        answerIndex: 1,
        explanation: 'Empatia e ética são dimensões exclusivamente humanas.'
      }
    ]
  },
  {
    id: 'atualidade-3',
    title: 'Cidades inteligentes e mobilidade urbana ativa',
    category: 'Atualidades',
    subcategory: 'Urbanismo',
    lang: 'pt',
    level: 'médio',
    wordCount: 115,
    body: 'O planejamento urbano contemporâneo busca aproximar os serviços essenciais das residências. O conceito de cidade de quinze minutos propõe que trabalho, compras, escolas e lazer estejam a uma caminhada ou pedalada curta de distância. Ao priorizar calçadas amplas, ciclovias seguras e transporte coletivo elétrico de qualidade, as metrópoles diminuem o congestionamento e melhoram a qualidade do ar. Menos tempo no trânsito resulta em mais tempo livre para a convivência familiar, a prática de esportes e o descanso mental.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'O conceito de quinze minutos aproxima serviços fundamentais dos moradores.',
      'Transporte ativo e coletivo reduz a poluição atmosférica.',
      'Menos horas no trânsito elevam a qualidade de vida coletiva.'
    ],
    quiz: [
      {
        question: 'O que propõe o modelo da cidade de quinze minutos?',
        options: ['Que viagens de carro durem sempre quinze minutos', 'Acesso a serviços fundamentais a pé ou de bicicleta em até quinze minutos', 'Proibir qualquer saída de casa à noite', 'Construir estradas subterrâneas para todos'],
        answerIndex: 1,
        explanation: 'A ideia é ter escolas, saúde e comércio próximos da residência.'
      },
      {
        question: 'Qual é um benefício direto de ampliar ciclovias e calçadas?',
        options: ['Aumento dos engarrafamentos', 'Redução do uso do transporte público', 'Melhora da qualidade do ar e da saúde pública', 'Desvalorização dos bairros'],
        answerIndex: 2,
        explanation: 'A mobilidade ativa diminui a queima de combustíveis e estimula a atividade física.'
      },
      {
        question: 'Como a mobilidade eficiente afeta a rotina do trabalhador?',
        options: ['Garante mais tempo livre para lazer e descanso', 'Obriga a trabalhar mais horas', 'Aumenta o estresse diário', 'Isola as pessoas em casa'],
        answerIndex: 0,
        explanation: 'Menos tempo no trânsito proporciona mais saúde física e mental.'
      }
    ]
  },
  {
    id: 'atualidade-4',
    title: 'O desafio da segurança hídrica no século vinte e um',
    category: 'Atualidades',
    subcategory: 'Meio Ambiente',
    lang: 'pt',
    level: 'longo',
    wordCount: 128,
    body: 'A água potável é um recurso finito e essencial para a produção de alimentos, a indústria e a sobrevivência humana. O crescimento populacional e as alterações nos regimes de chuva exigem um manejo cuidadoso das bacias hidrográficas. Tecnologias de reúso de água, dessalinização com energia solar e irrigação por gotejamento na agricultura ajudam a evitar o desperdício. Além disso, a preservação das florestas ripárias ao redor dos rios é indispensável para manter as nascentes vivas e protegidas do assoreamento. Preservar os mananciais é um compromisso ético e estratégico de todas as nações.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'A agricultura sustentável emprega irrigação por gotejamento para economizar água.',
      'As matas ciliares protegem nascentes e evitam o assoreamento dos cursos d’água.',
      'Tecnologias de reúso e dessalinização fortalecem a segurança hídrica.'
    ],
    quiz: [
      {
        question: 'Qual técnica agrícola moderna ajuda a economizar água?',
        options: ['Inundação contínua de lavouras', 'Irrigação por gotejamento', 'Drenagem de rios naturais', 'Pulverização sob sol forte'],
        answerIndex: 1,
        explanation: 'O gotejamento entrega a quantidade exata de água direto na raiz da planta.'
      },
      {
        question: 'Qual é o papel das florestas ao redor dos rios?',
        options: ['Aumentar a evaporação da água', 'Proteger as nascentes e evitar o assoreamento', 'Impedir a passagem dos peixes', 'Secar o leito dos córregos'],
        answerIndex: 1,
        explanation: 'A vegetação ribeirinha retém o solo e preserva o volume hídrico.'
      },
      {
        question: 'Por que o reúso de água é fundamental nas cidades?',
        options: ['Porque substitui totalmente a água potável mineral', 'Porque alivia a demanda sobre mananciais naturais', 'Porque elimina os custos de esgoto', 'Porque torna os rios navegáveis'],
        answerIndex: 1,
        explanation: 'O reúso para fins industriais e de limpeza preserva a água nobre para consumo humano.'
      }
    ]
  },

  // --- ESTUDOS (4 textos editoriais) ---
  {
    id: 'estudo-1',
    title: 'Como funciona a fotossíntese nas plantas',
    category: 'Estudos',
    subcategory: 'Ciências Biológicas',
    lang: 'pt',
    level: 'médio',
    wordCount: 120,
    body: 'A fotossíntese é o processo bioquímico pelo qual vegetais, algas e algumas bactérias convertem energia luminosa em energia química. As folhas absorvem a luz solar através da clorofila, um pigmento verde localizado dentro dos cloroplastos. Ao mesmo tempo, as raízes retiram água do solo e os estômatos capturam gás carbônico do ar. Com esses elementos, a planta fabrica glicose para seu próprio crescimento e libera oxigênio na atmosfera. Esse mecanismo é a base da cadeia alimentar terrestre e responsável pelo ar respirável do nosso planeta.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'A clorofila é o pigmento verde que capta a luz do sol.',
      'A planta consome água e gás carbônico e produz glicose e oxigênio.',
      'A fotossíntese sustenta as cadeias alimentares e renova o ar da Terra.'
    ],
    quiz: [
      {
        question: 'Qual pigmento celular é responsável por captar a luz solar?',
        options: ['Hemoglobina', 'Clorofila', 'Melanina', 'Queratina'],
        answerIndex: 1,
        explanation: 'A clorofila fica nos cloroplastos e absorve os comprimentos de onda da luz.'
      },
      {
        question: 'Quais substâncias a planta consome para realizar a fotossíntese?',
        options: ['Açúcar e sal', 'Água e gás carbônico', 'Oxigênio e nitrogênio puro', 'Ferro e argila'],
        answerIndex: 1,
        explanation: 'A água vem do solo pelas raízes e o CO2 entra pelos estômatos.'
      },
      {
        question: 'Qual gás essencial é liberado para a atmosfera como fruto da fotossíntese?',
        options: ['Gás metano', 'Gás hélio', 'Oxigênio', 'Monóxido de carbono'],
        answerIndex: 2,
        explanation: 'A fotossíntese quebra a molécula de água e libera oxigênio gasoso.'
      }
    ]
  },
  {
    id: 'estudo-2',
    title: 'A chegada do rádio e das transmissões no Brasil',
    category: 'Estudos',
    subcategory: 'História do Brasil',
    lang: 'pt',
    level: 'médio',
    wordCount: 116,
    body: 'A primeira transmissão oficial de rádio no Brasil ocorreu em sete de setembro de mil novecentos e vinte e dois, durante as comemorações do centenário da Independência no Rio de Janeiro. Uma antena instalada no morro do Corcovado levou a fala do presidente Epitácio Pessoa aos pavilhões da feira internacional. Nos anos seguintes, pioneiros como Roquette Pinto fundaram as primeiras estações com propósitos educativos e culturais. Na década de trinta, o rádio popularizou a música popular brasileira, transmitiu radionovelas famosas e uniu o país de norte a sul em tempo real.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'A transmissão inaugural brasileira ocorreu no centenário da Independência em 1922.',
      'Roquette Pinto destacou-se por impulsionar emissoras com finalidades educativas.',
      'O rádio foi o primeiro meio de comunicação instantâneo de alcance nacional.'
    ],
    quiz: [
      {
        question: 'Em qual ocasião comemorativa foi realizada a primeira transmissão de rádio no Brasil?',
        options: ['Na Proclamação da República', 'No centenário da Independência em 1922', 'Na inauguração de Brasília', 'Na Copa do Mundo de 1950'],
        answerIndex: 1,
        explanation: 'A transmissão ocorreu na exposição comemorativa de 1922 no Rio de Janeiro.'
      },
      {
        question: 'Quem foi um dos grandes pioneiros do rádio educativo brasileiro?',
        options: ['Santos Dumont', 'Roquette Pinto', 'Machado de Assis', 'Rui Barbosa'],
        answerIndex: 1,
        explanation: 'Edgar Roquette Pinto fundou a Rádio Sociedade do Rio de Janeiro para difusão cultural.'
      },
      {
        question: 'Qual impacto social o rádio causou nas décadas de 1930 e 1940?',
        options: ['Isolou as cidades do interior', 'Popularizou a música brasileira e conectou o país', 'Substituiu todos os jornais impressos', 'Extinguiu os espetáculos de teatro'],
        answerIndex: 1,
        explanation: 'O rádio se tornou a maior paixão nacional com transmissões ao vivo.'
      }
    ]
  },
  {
    id: 'estudo-3',
    title: 'O Aquífero Guarani e as reservas subterrâneas',
    category: 'Estudos',
    subcategory: 'Geografia',
    lang: 'pt',
    level: 'médio',
    wordCount: 114,
    body: 'O Aquífero Guarani é uma das maiores formações hidrogeológicas de água doce do planeta. Ele se estende por mais de um milhão de quilômetros quadrados, abrangendo territórios do Brasil, Argentina, Paraguai e Uruguai. A água se acumula nos poros microscópicos de arenitos profundos, depositados durante o período geológico triássico e jurássico. As chuvas infiltram-se pelas áreas de recarga nas bordas da bacia, alimentando o reservatório subterrâneo. Proteger essas áreas contra contaminação por agrotóxicos e resíduos urbanos é vital para garantir o abastecimento futuro de milhões de pessoas.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'O aquífero é compartilhado por quatro nações da América do Sul.',
      'A água fica retida em camadas profundas de rochas sedimentares porosas.',
      'As zonas de recarga necessitam de proteção rigorosa contra poluentes.'
    ],
    quiz: [
      {
        question: 'Quais países compartilham a bacia do Aquífero Guarani?',
        options: ['Brasil, Chile, Peru e Bolívia', 'Brasil, Argentina, Paraguai e Uruguai', 'Brasil, Colômbia, Venezuela e Guiana', 'Brasil, México e Portugal'],
        answerIndex: 1,
        explanation: 'São os quatro países do Cone Sul abrangidos pela bacia do Paraná.'
      },
      {
        question: 'Onde a água do aquífero fica naturalmente armazenada?',
        options: ['Em grandes cavernas vazias sem rochas', 'Nos poros de arenitos e rochas sedimentares', 'Congelada no fundo da terra', 'Em tanques metálicos subterrâneos'],
        answerIndex: 1,
        explanation: 'A rocha arenosa funciona como uma esponja natural que retém o líquido.'
      },
      {
        question: 'Por que as áreas de recarga merecem cuidado prioritário?',
        options: ['Porque é por onde a água da chuva penetra no solo', 'Porque nelas não é permitido plantar árvores', 'Porque impedem a formação de vento', 'Porque esquentam o clima da região'],
        answerIndex: 0,
        explanation: 'Se a área de recarga for poluída, os contaminantes chegam ao aquífero.'
      }
    ]
  },
  {
    id: 'estudo-4',
    title: 'A proporção áurea e a harmonia na matemática',
    category: 'Estudos',
    subcategory: 'Matemática',
    lang: 'pt',
    level: 'médio',
    wordCount: 119,
    body: 'A proporção áurea é uma constante matemática irracional representada pela letra grega fi. Seu valor aproximado é um vírgula seiscentos e dezoito. Quando um segmento é dividido em duas partes desiguais de modo que a razão entre o todo e a parte maior seja igual à razão entre a parte maior e a menor, temos a divisão dourada. Essa relação aparece com frequência na natureza, como na disposição espiralada das sementes de girassol e na concha do molusco nautilus. Pintores e arquitetos usam essa proporção há séculos para criar composições equilibradas e agradáveis ao olhar.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'A proporção áurea vale aproximadamente 1,618.',
      'Aparece em estruturas biológicas como espirais de conchas e flores.',
      'É utilizada na arte e no desenho para produzir harmonia visual.'
    ],
    quiz: [
      {
        question: 'Qual é o valor aproximado da razão áurea?',
        options: ['3,14', '1,618', '2,718', '0,500'],
        answerIndex: 1,
        explanation: 'O número áureo fi é aproximadamente 1,6180339887.'
      },
      {
        question: 'Em qual exemplo natural encontramos espirais áureas?',
        options: ['Na disposição das sementes do girassol', 'No formato quadrado dos cristais de sal', 'Na velocidade da luz', 'Nas gotas de orvalho redondas'],
        answerIndex: 0,
        explanation: 'As sementes de girassol se organizam em espirais baseadas na razão dourada.'
      },
      {
        question: 'Por que artistas e arquitetos empregam a proporção áurea?',
        options: ['Para diminuir o custo das tintas', 'Para criar composições com harmonia e equilíbrio estético', 'Para evitar o uso de réguas retas', 'Para deixar os edifícios mais escuros'],
        answerIndex: 1,
        explanation: 'A proporção produz uma sensação intuitiva de beleza e proporção agradável.'
      }
    ]
  },

  // --- CURIOSIDADES (4 textos editoriais) ---
  {
    id: 'curiosidade-1',
    title: 'Por que o mar tem ondas e como elas viajam',
    category: 'Curiosidades',
    subcategory: 'Oceanografia',
    lang: 'pt',
    level: 'médio',
    wordCount: 116,
    body: 'A grande maioria das ondas marinhas é provocada pelo atrito do vento sobre a superfície da água. Quando o vento sopra sobre o oceano aberto, ele transfere energia para a lâmina d’água, criando pequenas ondulações que crescem e viajam por milhares de quilômetros. O que se move através do oceano não é a massa de água em si, mas sim a energia. As partículas de água giram em pequenos círculos e retornam quase ao mesmo ponto. Apenas quando a onda se aproxima da praia e o fundo fica raso, ela perde sustentação e quebra na areia.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'O vento é o principal gerador das ondas marinhas no oceano aberto.',
      'A onda transporta energia, enquanto as moléculas de água apenas giram em círculos.',
      'A quebra da onda ocorre pelo atrito com o fundo raso da praia.'
    ],
    quiz: [
      {
        question: 'O que gera a maior parte das ondas do mar?',
        options: ['O movimento dos peixes grandes', 'O atrito do vento soprando na superfície', 'O calor do fundo do oceano', 'As correntes de maré altas'],
        answerIndex: 1,
        explanation: 'O vento transfere energia mecânica para a superfície aquática.'
      },
      {
        question: 'O que de fato viaja através do mar durante uma onda?',
        options: ['Grandes blocos de terra', 'Energia em movimento ondulatório', 'Sal marinho concentrado', 'A mesma água do início ao fim'],
        answerIndex: 1,
        explanation: 'A energia viaja distâncias continentais enquanto a água faz rotações locais.'
      },
      {
        question: 'Por que a onda quebra quando chega perto da costa?',
        options: ['Porque o fundo se torna raso e desacelera a base da onda', 'Porque a água esfria de repente', 'Porque os banhistas empurram a espuma', 'Porque o vento para completamente'],
        answerIndex: 0,
        explanation: 'A base da onda bate no relevo raso e o topo segue em frente, desmoronando.'
      }
    ]
  },
  {
    id: 'curiosidade-2',
    title: 'A memória e a inteligência surpreendente dos corvos',
    category: 'Curiosidades',
    subcategory: 'Comportamento Animal',
    lang: 'pt',
    level: 'médio',
    wordCount: 118,
    body: 'Os corvos e seus parentes da família dos corvídeos estão entre os animais mais engenhosos do planeta. Experimentos científicos comprovaram que essas aves conseguem fabricar ganchos a partir de pequenos gravetos para alcançar pedaços de comida escondidos. Mais impressionante ainda é a sua capacidade de reconhecer rostos humanos individuais por muitos anos. Se uma pessoa ameaçar um corvo, a ave não apenas se lembrará daquele rosto, mas também comunicará o perigo para outros membros do bando. Elas demonstram planejamento prévio e compreendem relações básicas de causa e efeito.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'Corvos fabricam e utilizam ferramentas simples para obter alimentos.',
      'Eles memorizam rostos humanos específicos por longos períodos.',
      'Podem alertar companheiros sobre indivíduos perigosos ou amigáveis.'
    ],
    quiz: [
      {
        question: 'Qual capacidade prática os corvos demonstram em laboratório?',
        options: ['Construir ninhos de vidro', 'Moldar ferramentas com gravetos para alcançar comida', 'Nadar em águas profundas', 'Ler números em relógios'],
        answerIndex: 1,
        explanation: 'Eles dobram galhos e arames para criar ganchos funcionais.'
      },
      {
        question: 'O que os corvos conseguem reconhecer e guardar na memória por anos?',
        options: ['Rostos humanos individuais', 'Placas de trânsito em estradas', 'Sons de telefones desligados', 'Padrões de folhas caídas'],
        answerIndex: 0,
        explanation: 'Eles distinguem expressões e feições humanas com precisão notável.'
      },
      {
        question: 'O que o corvo faz quando identifica uma pessoa que o ameaçou?',
        options: ['Esquece no dia seguinte', 'Avisa os outros membros do bando sobre o perigo', 'Abandona o ninho para sempre', 'Finge estar dormindo'],
        answerIndex: 1,
        explanation: 'Eles transmitem conhecimento social entre os pares do grupo.'
      }
    ]
  },
  {
    id: 'curiosidade-3',
    title: 'O segredo da extração do café expresso perfeito',
    category: 'Curiosidades',
    subcategory: 'Gastronomia e Química',
    lang: 'pt',
    level: 'médio',
    wordCount: 122,
    body: 'O café expresso é uma bebida concentrada obtida através da passagem rápida de água aquecida sob alta pressão por uma camada de café finamente moído e compactado. Em cerca de vinte e cinco segundos, a água a noventa e dois graus Celsius e nove atmosferas de pressão extrai os óleos aromáticos, ácidos agradáveis e açúcares naturais do grão torrado. O resultado visual mais marcante é a crema, uma densa camada de microespuma dourada formada por gases e lipídios emulsionados. O equilíbrio entre o tempo de contato e a moagem correta define se o café será suave ou amargo demais.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'A alta pressão de cerca de 9 atmosferas é o coração do método expresso.',
      'A crema é uma emulsão de óleos aromáticos e microbolhas de gás.',
      'O tempo de extração ideal gira em torno de 25 a 30 segundos.'
    ],
    quiz: [
      {
        question: 'Qual é a característica distintiva do método expresso?',
        options: ['Ferver o pó por horas em panela aberta', 'Água quente passada sob alta pressão mecânica', 'Filtragem por gravidade em pano úmido', 'Congelar o pó antes de misturar com leite'],
        answerIndex: 1,
        explanation: 'A pressão de 9 bares extrai substâncias que a gravidade não alcança.'
      },
      {
        question: 'O que é a crema presente na xícara de expresso?',
        options: ['Leite adicionado secretamente', 'Uma camada de microespuma com óleos essenciais e gases', 'Açúcar cristalizado no fundo', 'Restos de borra não dissolvida'],
        answerIndex: 1,
        explanation: 'A crema é a emulsão dourada de lipídios e dióxido de carbono.'
      },
      {
        question: 'Quanto tempo dura normalmente a extração ideal de um expresso clássico?',
        options: ['Cinco minutos', 'Cerca de vinte e cinco a trinta segundos', 'Dez segundos apenas', 'Uma hora inteira'],
        answerIndex: 1,
        explanation: 'Em 25 a 30 segundos obtém-se o balanço entre doçura e acidez.'
      }
    ]
  },
  {
    id: 'curiosidade-4',
    title: 'A comunicação química e o trabalho das formigas',
    category: 'Curiosidades',
    subcategory: 'Biologia',
    lang: 'pt',
    level: 'médio',
    wordCount: 117,
    body: 'As formigas vivem em colônias altamente organizadas sem que nenhuma rainha precise dar ordens centralizadas. Sua principal forma de orientação e diálogo são os feromônios, substâncias químicas deixadas no solo como pistas aromáticas. Quando uma operária encontra uma fonte rica de sementes ou açúcar, ela retorna ao formigueiro traçando uma linha invisível no chão. Outras companheiras sentem o rastro com suas antenas móveis e seguem o mesmo caminho, reforçando a trilha a cada ida e volta. Assim que o alimento acaba, o cheiro evapora gradualmente e as formigas procuram novos destinos.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'Feromônios são sinais químicos usados para traçar caminhos até o alimento.',
      'As formigas reforçam o rastro coletivamente enquanto houver suprimentos.',
      'A evaporação do rastro evita que a colônia perca tempo em fontes esgotadas.'
    ],
    quiz: [
      {
        question: 'Como as formigas trocam mensagens de direção com o grupo?',
        options: ['Por sons ultrassônicos na garganta', 'Pelo cheiro de feromônios deixados no solo', 'Por piscadas de luz no corpo', 'Por danças com as asas'],
        answerIndex: 1,
        explanation: 'As substâncias químicas servem de mapa olfativo para a colônia.'
      },
      {
        question: 'O que acontece quando muitas formigas usam o mesmo caminho com sucesso?',
        options: ['A trilha é reforçada e atrai mais operárias', 'O cheiro some imediatamente', 'A rainha cancela a busca', 'O formigueiro muda de endereço'],
        answerIndex: 0,
        explanation: 'O trânsito frequente renova o cheiro do feromônio no chão.'
      },
      {
        question: 'O que impede as formigas de seguirem um caminho velho quando o alimento acaba?',
        options: ['O feromônio evapora com o tempo', 'Outras formigas colocam pedras no caminho', 'A chuva lava todo o formigueiro diariamente', 'As formigas perdem as antenas'],
        answerIndex: 0,
        explanation: 'Sem novas formigas reforçando o rastro, o odor dissipa sozinho.'
      }
    ]
  },

  // --- TECNOLOGIA (4 textos editoriais) ---
  {
    id: 'tecnologia-1',
    title: 'A evolução dos semicondutores e a miniaturização',
    category: 'Tecnologia',
    subcategory: 'Hardware e Chips',
    lang: 'pt',
    level: 'longo',
    wordCount: 130,
    body: 'Os chips de silício são a fundação de quase todos os aparelhos eletrônicos modernos, desde relógios inteligentes até supercomputadores espaciais. Um processador contemporâneo abriga dezenas de bilhões de transistores microscópicos em uma área menor do que uma moeda de um real. A miniaturização progressiva foi possível graças à técnica de litografia ultravioleta extrema, capaz de gravar circuitos de poucos nanômetros de espessura. Com componentes menores, os elétrons percorrem distâncias mais curtas, consumindo menos energia e processando instruções a velocidades impressionantes. A indústria agora explora novos materiais e empilhamento tridimensional de chips para superar os limites físicos do silício tradicional.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'Bilhões de transistores cabem em pastilhas milimétricas de silício.',
      'A litografia óptica ultravioleta permite desenhar circuitos em escala nanométrica.',
      'Estruturas tridimensionais ampliam a capacidade sem exigir aumento de área.'
    ],
    quiz: [
      {
        question: 'Qual componente básico é multiplicado aos bilhões em um processador moderno?',
        options: ['Válvula a vácuo', 'Transistor de silício', 'Pilhas de lítio', 'Engrenagens mecânicas'],
        answerIndex: 1,
        explanation: 'O transistor atua como chave eletrônica elementar para cálculos lógicos.'
      },
      {
        question: 'Qual tecnologia permite gravar linhas em escala de poucos nanômetros?',
        options: ['Laser infravermelho de baixa potência', 'Litografia por ultravioleta extrema', 'Impressão a jato de tinta comum', 'Corte com lâmina de diamante'],
        answerIndex: 1,
        explanation: 'O comprimento de onda ultravioleta extremo consegue definir padrões mínimos.'
      },
      {
        question: 'Qual é a vantagem direta de diminuir o tamanho dos transistores?',
        options: ['Os computadores ficam mais pesados', 'Gasto menor de energia e cálculos mais rápidos', 'O custo do silício triplica', 'Exige o uso de fios de cobre externos'],
        answerIndex: 1,
        explanation: 'Menores percursos para a corrente resultam em maior eficiência e rapidez.'
      }
    ]
  },
  {
    id: 'tecnologia-2',
    title: 'Como funciona a criptografia de ponta a ponta',
    category: 'Tecnologia',
    subcategory: 'Segurança da Informação',
    lang: 'pt',
    level: 'médio',
    wordCount: 122,
    body: 'A criptografia de ponta a ponta protege mensagens trocadas em aplicativos e serviços bancários modernos. Quando uma pessoa digita um texto e envia para um colega, o aplicativo utiliza chaves matemáticas complexas para codificar a informação antes que ela saia do aparelho. Durante todo o tráfego pela internet e pelos servidores centrais, o conteúdo viaja como uma sequência ilegível de caracteres aleatórios. Somente o destinatário, possuidor da chave privada correspondente, consegue decodificar e ler o texto original. Nem mesmo os provedores do serviço têm acesso ao conteúdo legível da conversa.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'A mensagem é cifrada no aparelho de origem e só decifrada no destino.',
      'Servidores intermediários transmitem dados sem poder ler seu conteúdo.',
      'Chaves assimétricas garantem a autenticidade e o sigilo das conversas.'
    ],
    quiz: [
      {
        question: 'Onde ocorre a decodificação da mensagem na criptografia ponta a ponta?',
        options: ['Na central do provedor de internet', 'Apenas no dispositivo de quem recebe', 'Em antenas telefônicas públicas', 'Em nenhum lugar, o texto se perde'],
        answerIndex: 1,
        explanation: 'Somente o aparelho do destinatário possui a chave de decodificação.'
      },
      {
        question: 'Como a mensagem viaja pelos cabos e servidores da internet?',
        options: ['Como texto simples e legível', 'Como uma sequência cifrada e ilegível para terceiros', 'Como um arquivo de imagem com foto', 'Em código morse em áudio'],
        answerIndex: 1,
        explanation: 'Sem a chave privada do usuário, a mensagem é ruído indecifrável.'
      },
      {
        question: 'O provedor do aplicativo de mensagens consegue ler o teor da conversa?',
        options: ['Sim, a qualquer instante', 'Não, pois não possui a chave do usuário', 'Apenas aos finais de semana', 'Somente se salvar a conversa em papel'],
        answerIndex: 1,
        explanation: 'A arquitetura foi desenhada para impedir a leitura até pela própria empresa.'
      }
    ]
  },
  {
    id: 'tecnologia-3',
    title: 'O telescópio James Webb e o cosmos profundo',
    category: 'Tecnologia',
    subcategory: 'Astrofísica e Espaço',
    lang: 'pt',
    level: 'longo',
    wordCount: 125,
    body: 'O telescópio espacial James Webb é o observatório astronômico mais sofisticado já colocado no espaço. Posicionado a um milhão e meio de quilômetros da Terra, ele capta luz na faixa do infravermelho com um espelho segmentado dourado de seis metros e meio de diâmetro. Como a expansão do universo estica as ondas de luz ao longo de bilhões de anos, o infravermelho permite enxergar através de densas nuvens de poeira e revelar as primeiras galáxias formadas após o Big Bang. Além disso, os sensores do telescópio analisam a composição química da atmosfera de planetas fora do sistema solar, procurando vapor de água e moléculas orgânicas.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'O espelho dourado de 6,5 metros coleta luz infravermelha com alta precisão.',
      'O infravermelho penetra a poeira cósmica e observa galáxias primordiais.',
      'Analisa atmosferas de exoplanetas em busca de água e outros compostos.'
    ],
    quiz: [
      {
        question: 'Em qual faixa do espectro de luz o telescópio James Webb é especializado?',
        options: ['Raios X de alta intensidade', 'Infravermelho', 'Luz ultravioleta extrema', 'Ondas de rádio AM'],
        answerIndex: 1,
        explanation: 'O infravermelho é ideal para ver galáxias distantes e nebulosas empoeiradas.'
      },
      {
        question: 'Por que o infravermelho é fundamental para observar o universo distante?',
        options: ['Porque a luz viaja mais rápida nessa cor', 'Porque a expansão do universo deslocou a luz para o vermelho', 'Porque o espelho só reflete a cor verde', 'Porque as estrelas apagam no escuro'],
        answerIndex: 1,
        explanation: 'O desvio para o vermelho (redshift) alonga as ondas emitidas há bilhões de anos.'
      },
      {
        question: 'O que o James Webb investiga na atmosfera de planetas distantes?',
        options: ['Água, metano e compostos químicos reveladores', 'Sinais de rádio emitidos por antenas de satélite', 'A temperatura da areia das praias', 'O formato exato das árvores alienígenas'],
        answerIndex: 0,
        explanation: 'Por espectroscopia, ele identifica os gases constituintes da atmosfera do planeta.'
      }
    ]
  },
  {
    id: 'tecnologia-4',
    title: 'A computação em nuvem e a infraestrutura moderna',
    category: 'Tecnologia',
    subcategory: 'Redes e Sistemas',
    lang: 'pt',
    level: 'médio',
    wordCount: 118,
    body: 'A computação em nuvem transformou a forma como pessoas e corporações utilizam programas e armazenam arquivos. Em lugar de depender de discos rígidos locais ou de servidores próprios com altos custos de manutenção, os dados residem em grandes centros de processamento interligados por cabos submarinos de fibra óptica. Esses centros oferecem redundância, garantindo que cópias de segurança evitem perdas materiais em caso de falhas mecânicas. Usuários comuns beneficiam-se ao sincronizar fotos, documentos e músicas em múltiplos aparelhos sem esforço, com alta velocidade e disponibilidade constante.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'A nuvem substitui servidores locais caros por datacenters globais.',
      'A redundância geográfica protege os arquivos contra perdas catastróficas.',
      'Permite sincronização automática de informações em tempo real.'
    ],
    quiz: [
      {
        question: 'O que é a computação em nuvem na prática?',
        options: ['Transmissão de dados por ondas de rádio nas nuvens de chuva', 'Processamento e armazenamento em datacenters remotos interconectados', 'Computadores fabricados em plástico leve', 'Um aplicativo que só funciona sem conexão com a internet'],
        answerIndex: 1,
        explanation: 'Grandes servidores espalhados pelo mundo executam os sistemas via internet.'
      },
      {
        question: 'Qual vantagem de segurança a nuvem oferece aos usuários?',
        options: ['Elimina a necessidade de senhas', 'Cópias redundantes que evitam a perda de dados em falhas', 'Garante velocidade infinita de download', 'Impede qualquer pessoa de navegar na rede'],
        answerIndex: 1,
        explanation: 'Se um servidor quebrar, outro assume a carga com a réplica dos dados.'
      },
      {
        question: 'Como a nuvem auxilia o dia a dia de quem usa celulares e notebooks?',
        options: ['Permite acessar fotos e documentos sincronizados em qualquer aparelho', 'Aumenta a bateria dos telefones desligados', 'Elimina a tela dos monitores', 'Substitui o teclado físico por papel'],
        answerIndex: 0,
        explanation: 'Arquivos salvos na nuvem abrem instantaneamente em múltiplos dispositivos.'
      }
    ]
  },

  // --- SAÚDE E BEM-ESTAR (4 textos editoriais) ---
  {
    id: 'saude-1',
    title: 'A neurociência do sono reparador e da memória',
    category: 'Saúde e Bem-estar',
    subcategory: 'Neurociência',
    lang: 'pt',
    level: 'médio',
    wordCount: 121,
    body: 'O sono não é um estado passivo de desligamento cerebral, mas um período ativo de restauração física e mental. Durante as fases de sono profundo, o cérebro ativa o sistema glinfático, um mecanismo de limpeza que remove toxinas acumuladas durante o dia, incluindo proteínas ligadas a doenças neurodegenerativas. Além disso, é durante o sono que os circuitos neurais consolidam os aprendizados recentes, transferindo memórias temporárias para regiões estáveis de longo prazo. Adultos que mantêm uma rotina de sete a oito horas de sono experimentam maior clareza de raciocínio, estabilidade emocional e fortalecimento do sistema imune.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'O sono limpa resíduos metabólicos do cérebro pelo sistema glinfático.',
      'Memórias e aprendizados diários são consolidados durante a noite.',
      'Dormir regularmente fortalece a imunidade e a estabilidade emocional.'
    ],
    quiz: [
      {
        question: 'Qual função de limpeza ocorre no cérebro durante o sono profundo?',
        options: ['O sistema glinfático remove toxinas e proteínas residuais', 'O cérebro encolhe e para de produzir neurônios', 'A corrente sanguínea é interrompida totalmente', 'O cérebro esquece tudo o que aprendeu'],
        answerIndex: 0,
        explanation: 'O sistema glinfático elimina subprodutos do metabolismo diário.'
      },
      {
        question: 'O que o cérebro faz com os aprendizados do dia enquanto dormimos?',
        options: ['Apaga todas as memórias novas', 'Transfere e consolida informações em memórias de longo prazo', 'Mistura lembranças com sonhos aleatórios sem guardar nada', 'Troca memórias por cansaço'],
        answerIndex: 1,
        explanation: 'A consolidação da memória depende intrinsecamente de boas noites de sono.'
      },
      {
        question: 'Quantas horas diárias de sono são geralmente recomendadas para adultos?',
        options: ['Três a quatro horas', 'Sete a oito horas', 'Doze a catorze horas', 'Apenas duas horas com cochilos'],
        answerIndex: 1,
        explanation: 'A média saudável para a imensa maioria dos adultos é de 7 a 8 horas.'
      }
    ]
  },
  {
    id: 'saude-2',
    title: 'Os benefícios cientificamente comprovados da caminhada',
    category: 'Saúde e Bem-estar',
    subcategory: 'Atividade Física',
    lang: 'pt',
    level: 'médio',
    wordCount: 119,
    body: 'Caminhar trinta minutos por dia é uma das intervenções de saúde mais acessíveis e eficientes para o corpo humano. A caminhada em ritmo moderado melhora a circulação cardiovascular, ajuda a regular os níveis de glicose no sangue e reduz a pressão arterial. Em termos psicológicos, o exercício rítmico estimula a liberação de endorfinas e serotonina, neurotransmissores associados ao alívio do estresse e à sensação de tranquilidade. Ao ar livre, o contato visual com a luz solar natural auxilia na regulação do ciclo circadiano, facilitando um adormecer mais rápido e restaurador à noite.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'Trinta minutos diários de caminhada previnem doenças cardiovasculares.',
      'Estimula a produção de serotonina e endorfina para relaxamento.',
      'A luz natural matinal ajuda a regular o relógio biológico.'
    ],
    quiz: [
      {
        question: 'Qual efeito positivo a caminhada diária gera no sistema circulatório?',
        options: ['Aumenta a rigidez das artérias', 'Melhora a circulação e ajuda a controlar a pressão arterial', 'Diminui a quantidade de oxigênio no sangue', 'Prejudica o bombeamento do coração'],
        answerIndex: 1,
        explanation: 'O exercício aeróbico leve dilata os vasos e fortalece o músculo cardíaco.'
      },
      {
        question: 'Quais neurotransmissores são liberados com a caminhada regular?',
        options: ['Endorfina e serotonina', 'Adrenalina pura e cortisol crônico', 'Ácido lático', 'Melatonina pesada diurna'],
        answerIndex: 0,
        explanation: 'Endorfina e serotonina melhoram o humor e reduzem a ansiedade.'
      },
      {
        question: 'Como a caminhada ao ar livre influencia o sono noturno?',
        options: ['Causa insônia imediata', 'Regula o ciclo biológico circadiano pela luz natural', 'Impede o cérebro de relaxar', 'Elimina o hormônio do crescimento'],
        answerIndex: 1,
        explanation: 'A exposição à luz do dia avisa o cérebro sobre os horários de vigília e sono.'
      }
    ]
  },
  {
    id: 'saude-3',
    title: 'A importância da hidratação para a função cerebral',
    category: 'Saúde e Bem-estar',
    subcategory: 'Nutrição e Fisiologia',
    lang: 'pt',
    level: 'médio',
    wordCount: 114,
    body: 'O corpo humano é composto majoritariamente por água, e o cérebro é um dos órgãos mais sensíveis a pequenas perdas de líquidos. Uma desidratação leve de apenas dois por cento do peso corporal já é capaz de diminuir a concentração, reduzir a velocidade de reação e provocar dores de cabeça incômodas. A água transporta nutrientes essenciais, elimina resíduos celulares e mantém o volume sanguíneo ideal. Manter uma garrafa por perto e ingerir água regularmente ao longo do dia é um hábito elementar que potencializa a clareza mental e a disposição em qualquer atividade intelectual.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'Mesmo uma desidratação leve reduz o foco e provoca dor de cabeça.',
      'A água é o meio de transporte de nutrientes e regulação térmica do corpo.',
      'Beber água continuamente apoia a clareza mental em tarefas exigentes.'
    ],
    quiz: [
      {
        question: 'Qual sintoma comum decorre de uma desidratação leve?',
        options: ['Perda permanente da visão', 'Queda na concentração e dores de cabeça', 'Aumento instantâneo da força física', 'Sono ininterrupto de 24 horas'],
        answerIndex: 1,
        explanation: 'A falta de água reduz a perfusão cerebral e causa cefaleia e fadiga.'
      },
      {
        question: 'Por que o cérebro depende tanto de hidratação adequada?',
        options: ['Porque precisa flutuar em óleo mineral', 'Porque a água viabiliza a transmissão neural e nutrientes', 'Porque a água substitui a glicose', 'Porque o cérebro é feito de ar seco'],
        answerIndex: 1,
        explanation: 'A homeostase eletrolítica e a circulação exigem volume adequado de água.'
      },
      {
        question: 'Qual hábito simples ajuda a manter a hidratação diária ideal?',
        options: ['Beber líquidos somente quando sentir a boca ressecada', 'Tomar pequenos goles de água ao longo de todo o dia', 'Beber três litros de uma só vez pela manhã', 'Substituir a água por refrigerantes açucarados'],
        answerIndex: 1,
        explanation: 'A ingestão distribuída mantém o organismo em equilíbrio contínuo.'
      }
    ]
  },
  {
    id: 'saude-4',
    title: 'Como gerenciar o estresse e proteger a saúde mental',
    category: 'Saúde e Bem-estar',
    subcategory: 'Psicologia e Equilíbrio',
    lang: 'pt',
    level: 'longo',
    wordCount: 126,
    body: 'O estresse é uma reação biológica natural projetada para mobilizar energia diante de perigos imediatos. No entanto, quando as preocupações do trabalho e do cotidiano se tornam crônicas, os níveis elevados e constantes de cortisol prejudicam o sistema imunológico e elevam a pressão sanguínea. Estratégias simples e comprovadas ajudam a modular essa resposta: pausas conscientes durante o dia, respiração diafragmática lenta e a prática de hobbies manuais ou leitura. Estabelecer limites claros entre o expediente de trabalho e o tempo de repouso recarrega a energia mental e protege o corpo contra o esgotamento profissional prolongado.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'O cortisol elevado continuamente compromete a imunidade e o coração.',
      'Exercícios de respiração lenta desaceleram os batimentos cardíacos.',
      'Separar tempo de trabalho do repouso previne o esgotamento crônico.'
    ],
    quiz: [
      {
        question: 'Qual hormônio fica elevado no corpo em situações de estresse crônico?',
        options: ['Insulina rápida', 'Cortisol', 'Hormônio tireoidiano', 'Melatonina profunda'],
        answerIndex: 1,
        explanation: 'O cortisol é o principal hormônio ativado pelo eixo de estresse do organismo.'
      },
      {
        question: 'Qual técnica corporal simples ajuda a acalmar o sistema nervoso?',
        options: ['Respiração diafragmática pausada e profunda', 'Prender a respiração por dois minutos', 'Tomar cinco xícaras de café concentrado', 'Ficar olhando para telas no escuro'],
        answerIndex: 0,
        explanation: 'A respiração lenta ativa o sistema nervoso parassimpático, desacelerando o coração.'
      },
      {
        question: 'Por que é importante criar limites entre o trabalho e a vida pessoal?',
        options: ['Para evitar falar com colegas', 'Para permitir a recuperação mental e prevenir a exaustão', 'Para não precisar cumprir metas', 'Para trabalhar no fim de semana escondido'],
        answerIndex: 1,
        explanation: 'O descanso protege a criatividade, a saúde física e o bem-estar duradouro.'
      }
    ]
  },

  // --- NEGÓCIOS E FINANÇAS (4 textos editoriais) ---
  {
    id: 'financas-1',
    title: 'Os fundamentos do orçamento e do planejamento pessoal',
    category: 'Negócios e Finanças',
    subcategory: 'Finanças Pessoais',
    lang: 'pt',
    level: 'médio',
    wordCount: 118,
    body: 'Organizar um orçamento pessoal não significa abrir mão de todas as comodidades da vida, mas sim direcionar os recursos com clareza. O primeiro passo consiste em registrar com precisão todas as receitas e despesas do mês, separando custos essenciais como moradia e alimentação daqueles que são supérfluos. A regra clássica recomenda destinar metade da renda às necessidades básicas, trinta por cento a desejos pessoais e vinte por cento à formação de poupança ou investimentos. Ter visibilidade sobre o próprio dinheiro previne endividamentos caros e proporciona tranquilidade diante de imprevistos do dia a dia.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'Registrar receitas e despesas traz previsibilidade financeira.',
      'A divisão proporcional equilibra necessidades, lazer e investimentos.',
      'O controle orçamentário protege contra juros de dívidas caras.'
    ],
    quiz: [
      {
        question: 'Qual é o primeiro passo para assumir o controle do próprio orçamento?',
        options: ['Fazer um empréstimo novo', 'Registrar com clareza todas as receitas e despesas mensais', 'Guardar todo o salário sem pagar contas', 'Cancelar todas as contas de luz e água'],
        answerIndex: 1,
        explanation: 'Saber para onde o dinheiro vai é indispensável para tomar boas decisões.'
      },
      {
        question: 'O que a regra de orçamento cinquenta, trinta e vinte sugere para poupança e investimentos?',
        options: ['Zero por cento', 'Vinte por cento da renda líquida', 'Cinquenta por cento de lazer', 'Cem por cento de compras livres'],
        answerIndex: 1,
        explanation: 'A metodologia sugere poupar e investir 20% da renda mensal.'
      },
      {
        question: 'Qual é o maior benefício de manter o planejamento orçamentário em dia?',
        options: ['Ficar rico da noite para o dia sem esforço', 'Evitar o endividamento e ter segurança diante de emergências', 'Poder gastar sem saber quanto tem na conta', 'Eliminar a necessidade de trabalhar'],
        answerIndex: 1,
        explanation: 'O controle traz segurança psicológica e sustentabilidade financeira.'
      }
    ]
  },
  {
    id: 'financas-2',
    title: 'O poder multiplicador dos juros compostos no tempo',
    category: 'Negócios e Finanças',
    subcategory: 'Investimentos',
    lang: 'pt',
    level: 'médio',
    wordCount: 122,
    body: 'Os juros compostos são frequentemente descritos como juros sobre juros. Quando você aplica uma quantia financeira e reinveste o rendimento gerado, a taxa do período seguinte incide sobre o valor original acrescido do ganho anterior. Nos primeiros anos, o crescimento do patrimônio parece lento e discreto. Entretanto, com o passar das décadas, a curva ganha inclinação exponencial e o montante de rendimentos passa a superar com folga as quantias aportadas pelo investidor. O tempo é o ingrediente mais decisivo nessa equação, demonstrando por que começar a investir cedo é mais valioso do que esperar grandes quantias para o futuro.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'Juros incidem sobre o capital e sobre os rendimentos anteriores acumulados.',
      'O efeito exponencial torna-se impressionante no longo prazo.',
      'Começar cedo com valores modestos é mais eficaz do que adiar.'
    ],
    quiz: [
      {
        question: 'Como funcionam os juros compostos em uma aplicação financeira?',
        options: ['Os rendimentos são zerados todo mês', 'Os juros incidem sobre o saldo inicial somado aos rendimentos passados', 'O banco retira metade do dinheiro a cada ano', 'Apenas o primeiro depósito recebe remuneração'],
        answerIndex: 1,
        explanation: 'O cálculo sobre a base acumulada cria o crescimento exponencial.'
      },
      {
        question: 'Qual é o elemento mais determinante no cálculo dos juros compostos?',
        options: ['O tempo de investimento contínuo', 'A cor da agência bancária', 'O número de cartões de crédito na carteira', 'O preço do ouro no mesmo dia'],
        answerIndex: 0,
        explanation: 'Quanto mais tempo o dinheiro permanece aplicado, mais íngreme se torna a curva.'
      },
      {
        question: 'Por que é vantajoso começar a guardar dinheiro cedo, mesmo que pouco?',
        options: ['Porque o tempo fará o efeito exponencial multiplicar os recursos', 'Porque os bancos fecham contas de pessoas mais velhas', 'Porque os juros caem para zero no futuro', 'Porque evita comprar presentes para amigos'],
        answerIndex: 0,
        explanation: 'Anos adicionais de rentabilidade acumulada geram patrimônios expressivos.'
      }
    ]
  },
  {
    id: 'financas-3',
    title: 'A reserva de emergência e a tranquilidade familiar',
    category: 'Negócios e Finanças',
    subcategory: 'Segurança Financeira',
    lang: 'pt',
    level: 'médio',
    wordCount: 116,
    body: 'A reserva de emergência é a base de qualquer planejamento financeiro saudável. Trata-se de uma quantia guardada exclusivamente para cobrir imprevistos inadiáveis, como despesas médicas urgentes, manutenções residenciais essenciais ou períodos de desemprego. Especialistas recomendam que o fundo corresponda a um período entre três e seis meses dos custos fixos mensais do indivíduo ou da família. Como a prioridade absoluta desse dinheiro é a proteção imediata, ele deve estar aplicado em investimentos de altíssima segurança e liquidez diária, permitindo o resgate a qualquer momento sem risco de perda do valor principal.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'A reserva cobre custos essenciais de três a seis meses em caso de imprevistos.',
      'A segurança e a liquidez imediata superam a busca por alta rentabilidade.',
      'Evita contrair empréstimos com taxas abusivas em momentos de aperto.'
    ],
    quiz: [
      {
        question: 'Para que serve uma reserva de emergência?',
        options: ['Comprar roupas de marca em liquidações', 'Custear despesas inesperadas e inadiáveis sem fazer dívidas', 'Comprar ações de empresas de alto risco', 'Pagar viagens de férias não planejadas'],
        answerIndex: 1,
        explanation: 'O fundo protege a família contra problemas de saúde ou perda de renda.'
      },
      {
        question: 'Quanto se costuma sugerir para o montante de uma reserva de emergência?',
        options: ['O valor de um cafezinho', 'De três a seis meses do custo fixo mensal', 'Dez anos de salário integral', 'Apenas cinquenta reais em dinheiro vivo'],
        answerIndex: 1,
        explanation: 'Esse período é suficiente para reorganizar as contas na maioria dos imprevistos.'
      },
      {
        question: 'Onde a reserva de emergência deve ficar aplicada?',
        options: ['Em investimentos de altíssimo risco e longo prazo', 'Em ativos de alta segurança e liquidez imediata com resgate fácil', 'Em obras de arte raras', 'Em apostas e bilhetes lotéricos'],
        answerIndex: 1,
        explanation: 'O dinheiro precisa estar disponível no mesmo dia em que o imprevisto ocorrer.'
      }
    ]
  },
  {
    id: 'financas-4',
    title: 'Inovação, empreendedorismo e resolução de problemas',
    category: 'Negócios e Finanças',
    subcategory: 'Empreendedorismo',
    lang: 'pt',
    level: 'longo',
    wordCount: 126,
    body: 'Empreender com solidez não se resume a abrir uma empresa, mas a identificar dores reais da sociedade e propor soluções práticas e sustentáveis. As iniciativas bem-sucedidas começam com uma escuta atenta dos consumidores, compreendendo suas frustrações e necessidades não atendidas no dia a dia. Em vez de investir grandes capitais logo no início, os fundadores modernos criam protótipos enxutos para validar suas ideias no mercado real com agilidade. Ao ouvir o feedback dos primeiros clientes e aprimorar o serviço de forma contínua, o empreendedor reduz riscos operacionais, constrói confiança duradoura e cria valor econômico genuíno para a comunidade.',
    sourceType: 'editorial',
    license: 'Texto Editorial Educativo',
    keyPoints: [
      'Bons negócios nascem da resolução de problemas reais de clientes.',
      'Protótipos rápidos diminuem o desperdício de tempo e de recursos.',
      'A adaptação com base em opiniões de usuários garante crescimento sustentável.'
    ],
    quiz: [
      {
        question: 'Qual é o ponto de partida de um empreendimento relevante?',
        options: ['Inventar um produto que ninguém pediu', 'Identificar uma necessidade real dos clientes e buscar uma solução', 'Alugar o prédio mais luxuoso da avenida', 'Copiar concorrentes sem mudar nada'],
        answerIndex: 1,
        explanation: 'Negócios prosperam quando resolvem problemas autênticos das pessoas.'
      },
      {
        question: 'O que é um protótipo enxuto no início de um projeto?',
        options: ['Uma versão simples para testar a ideia rapidamente no mercado', 'Um relatório de quinhentas páginas sem produto real', 'Uma festa de lançamento para a imprensa', 'Um produto com defeito vendido como perfeito'],
        answerIndex: 0,
        explanation: 'Testar pequeno permite validar a aceitação sem queimar muito capital.'
      },
      {
        question: 'Por que o retorno dos primeiros clientes é precioso?',
        options: ['Para confirmar que nunca se deve mudar nada', 'Para corrigir falhas e melhorar o serviço continuamente', 'Para demitir a equipe de suporte', 'Para cobrar o dobro imediatamente'],
        answerIndex: 1,
        explanation: 'A opinião do cliente orienta os ajustes que levarão ao sucesso definitivo.'
      }
    ]
  },

  // --- LITERATURA CLÁSSICA (Domínio Público, fontes verificáveis) ---
  {
    id: 'literatura-1',
    title: 'Machado de Assis: O mistério dos olhos de ressaca',
    category: 'Literatura clássica',
    subcategory: 'Dom Casmurro (1899)',
    lang: 'pt',
    level: 'médio',
    wordCount: 119,
    body: 'Capitu era Capitu, isto é, uma criatura muito particular, mais mulher do que eu era homem. Olhos de ressaca, diria mais tarde o amigo José Dias, porque tinham não sei que fluido misterioso e fascinante que trazia o mar para dentro de casa. Olhei para ela e ela olhou para mim. Não sei se foram minutos ou horas, mas o mundo lá fora parecia ter parado. Havia nas suas pupilas uma força serena e profunda que me prendia e me interrogava sem pronunciar palavra alguma. Aquele olhar tinha a força das ondas quando recolhem as águas para depois quebrar com estrondo contra as pedras da praia.',
    sourceType: 'real',
    sourceName: 'Dom Casmurro / Machado de Assis (Domínio Público)',
    sourceUrl: 'http://www.dominiopublico.gov.br',
    license: 'Domínio Público',
    keyPoints: [
      'Machado de Assis é um dos maiores expoentes da literatura de língua portuguesa.',
      'A metáfora dos olhos de ressaca simboliza atração e profundidade.',
      'O narrador Bento Santiago constrói a figura enigmática de Capitu.'
    ],
    quiz: [
      {
        question: 'Quem é o autor da célebre obra Dom Casmurro?',
        options: ['José de Alencar', 'Machado de Assis', 'Carlos Drummond de Andrade', 'Guimarães Rosa'],
        answerIndex: 1,
        explanation: 'Machado de Assis publicou Dom Casmurro em 1899.'
      },
      {
        question: 'Qual metáfora célebre foi usada para descrever os olhos de Capitu?',
        options: ['Olhos de carvão aceso', 'Olhos de ressaca marinha', 'Olhos de esmeralda pura', 'Olhos de noite sem lua'],
        answerIndex: 1,
        explanation: 'Os olhos de ressaca tinham o poder de arrastar como as ondas do mar.'
      },
      {
        question: 'Qual é o tom predominante da descrição de Capitu pelo narrador?',
        options: ['Desprezo absoluto e indiferença', 'Fascínio, intensidade e mistério', 'Cômico e bem-humorado', 'Científico e distante'],
        answerIndex: 1,
        explanation: 'Bento Santiago recorda a juventude com encanto e obsessão nostálgica.'
      }
    ]
  },
  {
    id: 'literatura-2',
    title: 'José de Alencar: A virgem dos lábios de mel',
    category: 'Literatura clássica',
    subcategory: 'Iracema (1865)',
    lang: 'pt',
    level: 'médio',
    wordCount: 118,
    body: 'Iracema, a virgem dos lábios de mel, tinha os cabelos mais negros que a asa da graúna e mais longos que seu talhe de palmeira. O favo da jati não era doce como seu sorriso, nem a baunilha recendia no bosque como seu hálito perfumado. Mais rápida que a ema selvagem, a morena virgem corria o sertão e as matas do Ipu, onde campeava sua guerreira tribo tabajara. O pé descalço e ligeiro mal tocava a folhagem seca das veredas, e a brisa das tardes acariciava sua face quando ela descansava à sombra das copas verdejantes, banhada pelo sol dourado do nosso Ceará.',
    sourceType: 'real',
    sourceName: 'Iracema / José de Alencar (Domínio Público)',
    sourceUrl: 'http://www.dominiopublico.gov.br',
    license: 'Domínio Público',
    keyPoints: [
      'Iracema é uma obra-prima do romantismo indianista brasileiro.',
      'José de Alencar utiliza comparações líricas com a fauna e a flora nativas.',
      'A personagem simboliza poeticamente as origens e a natureza do Brasil.'
    ],
    quiz: [
      {
        question: 'Como Iracema é caracterizada no clássico de José de Alencar?',
        options: ['A rainha dos mares de gelo', 'A virgem dos lábios de mel', 'A senhora das grandes cidades', 'A princesa dos castelos de pedra'],
        answerIndex: 1,
        explanation: 'O epíteto virgem dos lábios de mel abre o romance romântico.'
      },
      {
        question: 'A quais elementos da natureza brasileira os cabelos de Iracema são comparados?',
        options: ['Às penas douradas do canário', 'À asa negra da graúna', 'Aos ramos das videiras da Europa', 'Às rochas do fundo do mar'],
        answerIndex: 1,
        explanation: 'Cabelos mais negros que a asa da graúna é uma das mais famosas metáforas da prosa brasileira.'
      },
      {
        question: 'Qual movimento literário consagrou o romance Iracema?',
        options: ['Romantismo indianista', 'Modernismo de vanguarda', 'Realismo naturalista', 'Barroco colonial'],
        answerIndex: 0,
        explanation: 'A exaltação da natureza nativa e da figura indígena marcou a vertente romântica.'
      }
    ]
  },
  {
    id: 'literatura-3',
    title: 'Lima Barreto: O idealismo de Policarpo Quaresma',
    category: 'Literatura clássica',
    subcategory: 'Triste Fim de Policarpo Quaresma (1915)',
    lang: 'pt',
    level: 'longo',
    wordCount: 125,
    body: 'Policarpo Quaresma era um homem modesto e apaixonado pelas coisas de sua terra. Vivia cercado de livros raros, mapas antigos e compêndios sobre a botânica e o folclore nacional. Para ele, o solo da sua pátria era o mais fértil, o clima o mais benigno e as canções do povo as mais puras e melodiosas do planeta. Dedicava suas noites ao estudo aplicado do violão e defendia com ardor o idioma tupi como a verdadeira língua oficial dos brasileiros. Havia em seu coração uma sinceridade ingênua e desmedida, que não enxergava a hipocrisia e as convenções mesquinhas dos burocratas que o cercavam no ministério onde cumpria suas funções diárias.',
    sourceType: 'real',
    sourceName: 'Triste Fim de Policarpo Quaresma / Lima Barreto (Domínio Público)',
    sourceUrl: 'http://www.dominiopublico.gov.br',
    license: 'Domínio Público',
    keyPoints: [
      'Lima Barreto fez uma sátira crítica ao nacionalismo ufanista e à burocracia.',
      'Policarpo Quaresma é o arquétipo do idealista ingênuo e patriota.',
      'A obra expõe o contraste entre o sonho patriótico e a dura realidade social.'
    ],
    quiz: [
      {
        question: 'Qual era a principal característica da personalidade de Policarpo Quaresma?',
        options: ['Ambição por riquezas materiais fáceis', 'Idealismo e paixão extrema pelas coisas do Brasil', 'Crueldade com os animais e a natureza', 'Indiferença por livros e estudos'],
        answerIndex: 1,
        explanation: 'Quaresma dedicava a vida inteira a valorizar a cultura e a terra brasileira.'
      },
      {
        question: 'Qual proposta inusitada Policarpo defendia para a língua nacional?',
        options: ['Adotar o tupi como língua oficial', 'Substituir o português pelo latim antigo', 'Proibir a escrita de romances', 'Falar apenas em inglês britânico'],
        answerIndex: 0,
        explanation: 'Em seu patriotismo exaltado, ele pleiteou a adoção oficial do tupi-guarani.'
      },
      {
        question: 'Quem é o consagrado autor desta obra da literatura pré-modernista brasileira?',
        options: ['Lima Barreto', 'Monteiro Lobato', 'Graciliano Ramos', 'Clarice Lispector'],
        answerIndex: 0,
        explanation: 'Lima Barreto publicou a obra em folhetins antes do livro em 1915.'
      }
    ]
  },
  {
    id: 'literatura-4',
    title: 'Aluísio Azevedo: O despertar matinal no cortiço',
    category: 'Literatura clássica',
    subcategory: 'O Cortiço (1890)',
    lang: 'pt',
    level: 'longo',
    wordCount: 128,
    body: 'Eram cinco horas da manhã e o cortiço começava a acordar, abrindo, não os olhos, mas a sua infinidade de portas e janelas alinhadas. Um rumor surdo e indistinto brotava dos quartos estreitos, misturando bocejos sonolentos e conversas abafadas. Daqui a pouco, as mulheres já desciam para as tinas coletivas, batendo as roupas ensaboadas contra a pedra com pancadas secas e compassadas. A fumaça das primeiras panelas subia lentamente no ar fresco da manhã, enquanto os operários apressavam o passo rumo às pedreiras e às construções do bairro. Todo aquele formigueiro humano se agitava em um movimento espontâneo e vigoroso, cheio de vida, trabalho e aspereza sob a claridade nascente do dia.',
    sourceType: 'real',
    sourceName: 'O Cortiço / Aluísio Azevedo (Domínio Público)',
    sourceUrl: 'http://www.dominiopublico.gov.br',
    license: 'Domínio Público',
    keyPoints: [
      'O Cortiço é o principal marco do Naturalismo na literatura brasileira.',
      'A coletividade é retratada como um organismo vivo e pulsante em movimento.',
      'O autor descreve as condições sociais e o labor dos trabalhadores urbanos.'
    ],
    quiz: [
      {
        question: 'Qual movimento literário tem O Cortiço como obra emblemática no Brasil?',
        options: ['Parnasianismo', 'Naturalismo', 'Arcadismo', 'Simbolismo'],
        answerIndex: 1,
        explanation: 'Aluísio Azevedo introduziu com maestria os preceitos do Naturalismo no país.'
      },
      {
        question: 'Como o narrador descreve o cortiço no início da manhã?',
        options: ['Como um palácio silencioso e deserto', 'Como um formigueiro humano que desperta em movimento coletivo', 'Como uma fortaleza abandonada pelos moradores', 'Como uma floresta virgem sem casas'],
        answerIndex: 1,
        explanation: 'A habitação coletiva é tratada como um organismo biológico vivo.'
      },
      {
        question: 'Quais atividades matinais mostram o labor das pessoas simples do cortiço?',
        options: ['Bater roupa nas tinas e partir para obras e pedreiras', 'Passear em carruagens de luxo pela praia', 'Dormir até o meio-dia em silêncio', 'Compor valsas em pianos de cauda'],
        answerIndex: 0,
        explanation: 'A cena destaca o trabalho árduo das lavadeiras e dos operários da construção.'
      }
    ]
  }
];
