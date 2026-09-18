const { db } = require('../config/database');

/**
 * Banco de Questões Didáticas estruturadas para Ensino Fundamental II
 */
const EQUATIONS_BANK = {
  facil: [
    {
      id: 'eq_f_1',
      equation: 'x + 5 = 12',
      leftDescription: 'Caixa com peso x e 5 pesos de 1kg',
      rightDescription: '12 pesos de 1kg',
      leftWeight: 'x + 5',
      rightWeight: '12',
      leftItems: [{ type: 'variable', label: 'x' }, { type: 'weight', value: 5, label: '+5' }],
      rightItems: [{ type: 'weight', value: 12, label: '12' }],
      solution: 7,
      options: [5, 7, 8, 17],
      hints: [
        '💡 Dica 1: Para manter a balança em equilíbrio e isolar o x, precisamos retirar 5 do lado esquerdo.',
        '💡 Dica 2: Se tiramos 5 do lado esquerdo, devemos subtrair 5 do lado direito também: x = 12 - 5.',
        '💡 Dica 3: Basta efetuar a subtração: 12 menos 5.'
      ],
      explanation: {
        title: 'Como resolver x + 5 = 12:',
        steps: [
          '1. Queremos encontrar o valor da incógnita "x".',
          '2. O número 5 está somando do lado esquerdo. Pela operação inversa, subtraímos 5 de ambos os lados da balança:',
          '   x + 5 - 5 = 12 - 5',
          '3. x = 7.',
          '4. Verificação: 7 + 5 = 12. Balança perfeitamente equilibrada!'
        ]
      }
    },
    {
      id: 'eq_f_2',
      equation: 'x - 4 = 9',
      leftDescription: 'Caixa com peso x retirando 4kg',
      rightDescription: '9 pesos de 1kg',
      leftWeight: 'x - 4',
      rightWeight: '9',
      leftItems: [{ type: 'variable', label: 'x' }, { type: 'weight', value: -4, label: '-4' }],
      rightItems: [{ type: 'weight', value: 9, label: '9' }],
      solution: 13,
      options: [5, 12, 13, 15],
      hints: [
        '💡 Dica 1: A operação inversa da subtração é a adição.',
        '💡 Dica 2: Para anular o -4 da balança, somamos 4 nos dois pratos.',
        '💡 Dica 3: x = 9 + 4.'
      ],
      explanation: {
        title: 'Como resolver x - 4 = 9:',
        steps: [
          '1. O número 4 está subtraindo no lado esquerdo da balança.',
          '2. Adicionamos 4 a ambos os membros para manter a igualdade:',
          '   x - 4 + 4 = 9 + 4',
          '3. x = 13.',
          '4. Verificação: 13 - 4 = 9. Correto!'
        ]
      }
    },
    {
      id: 'eq_f_3',
      equation: '3x = 18',
      leftDescription: '3 caixas idênticas de peso x',
      rightDescription: '18 pesos de 1kg',
      leftWeight: '3x',
      rightWeight: '18',
      leftItems: [{ type: 'variable', label: 'x' }, { type: 'variable', label: 'x' }, { type: 'variable', label: 'x' }],
      rightItems: [{ type: 'weight', value: 18, label: '18' }],
      solution: 6,
      options: [4, 6, 9, 15],
      hints: [
        '💡 Dica 1: Temos 3 caixas de valor "x". Elas juntas pesam 18.',
        '💡 Dica 2: A operação inversa da multiplicação por 3 é a divisão por 3.',
        '💡 Dica 3: Divida 18 igualmente entre as 3 caixas: x = 18 / 3.'
      ],
      explanation: {
        title: 'Como resolver 3x = 18:',
        steps: [
          '1. O coeficiente 3 está multiplicando a incógnita "x".',
          '2. Dividimos ambos os lados da balança por 3:',
          '   (3x) / 3 = 18 / 3',
          '3. x = 6.',
          '4. Verificação: 3 * 6 = 18. Perfeito!'
        ]
      }
    },
    {
      id: 'eq_f_4',
      equation: 'x + 8 = 20',
      leftDescription: 'Caixa x mais 8kg',
      rightDescription: '20 pesos de 1kg',
      leftWeight: 'x + 8',
      rightWeight: '20',
      leftItems: [{ type: 'variable', label: 'x' }, { type: 'weight', value: 8, label: '+8' }],
      rightItems: [{ type: 'weight', value: 20, label: '20' }],
      solution: 12,
      options: [10, 11, 12, 28],
      hints: [
        '💡 Dica 1: Subtraia 8 de ambos os membros da igualdade.',
        '💡 Dica 2: x = 20 - 8.',
        '💡 Dica 3: Efetue a subtração: 20 menos 8.'
      ],
      explanation: {
        title: 'Como resolver x + 8 = 20:',
        steps: [
          '1. Isole o termo com a variável x.',
          '2. Subtraia 8 de ambos os lados:',
          '   x = 20 - 8',
          '3. x = 12.',
          '4. Verificação: 12 + 8 = 20.'
        ]
      }
    }
  ],
  medio: [
    {
      id: 'eq_m_1',
      equation: '2x + 3 = 11',
      leftDescription: '2 caixas x e peso de 3kg',
      rightDescription: '11 pesos de 1kg',
      leftWeight: '2x + 3',
      rightWeight: '11',
      leftItems: [{ type: 'variable', label: '2x' }, { type: 'weight', value: 3, label: '+3' }],
      rightItems: [{ type: 'weight', value: 11, label: '11' }],
      solution: 4,
      options: [3, 4, 7, 8],
      hints: [
        '💡 Dica 1: Primeiro passo: elimine o termo numérico +3 subtraindo 3 dos dois pratos.',
        '💡 Dica 2: Ficamos com: 2x = 11 - 3 -> 2x = 8.',
        '💡 Dica 3: Segundo passo: divida ambos os lados por 2 -> x = 8 / 2.'
      ],
      explanation: {
        title: 'Como resolver 2x + 3 = 11:',
        steps: [
          '1. Primeiro subtraímos 3 de ambos os membros para isolar o termo com x:',
          '   2x + 3 - 3 = 11 - 3  =>  2x = 8',
          '2. Agora dividimos ambos os lados por 2:',
          '   x = 8 / 2  =>  x = 4',
          '3. Verificação: 2*(4) + 3 = 8 + 3 = 11. Equação correta!'
        ]
      }
    },
    {
      id: 'eq_m_2',
      equation: '3x - 5 = 16',
      leftDescription: '3 caixas x retirando 5kg',
      rightDescription: '16 pesos de 1kg',
      leftWeight: '3x - 5',
      rightWeight: '16',
      leftItems: [{ type: 'variable', label: '3x' }, { type: 'weight', value: -5, label: '-5' }],
      rightItems: [{ type: 'weight', value: 16, label: '16' }],
      solution: 7,
      options: [5, 6, 7, 9],
      hints: [
        '💡 Dica 1: Primeiro anule o -5 somando 5 nos dois pratos da balança.',
        '💡 Dica 2: Teremos: 3x = 16 + 5 -> 3x = 21.',
        '💡 Dica 3: Divida 21 por 3 para achar o x individual.'
      ],
      explanation: {
        title: 'Como resolver 3x - 5 = 16:',
        steps: [
          '1. Somamos 5 a ambos os lados:',
          '   3x = 16 + 5  =>  3x = 21',
          '2. Dividimos ambos os lados por 3:',
          '   x = 21 / 3  =>  x = 7',
          '3. Verificação: 3*(7) - 5 = 21 - 5 = 16.'
        ]
      }
    },
    {
      id: 'eq_m_3',
      equation: '4x + 6 = 26',
      leftDescription: '4 caixas x e peso de 6kg',
      rightDescription: '26 pesos de 1kg',
      leftWeight: '4x + 6',
      rightWeight: '26',
      leftItems: [{ type: 'variable', label: '4x' }, { type: 'weight', value: 6, label: '+6' }],
      rightItems: [{ type: 'weight', value: 26, label: '26' }],
      solution: 5,
      options: [4, 5, 8, 10],
      hints: [
        '💡 Dica 1: Subtraia 6 dos dois lados da balança.',
        '💡 Dica 2: 4x = 26 - 6 -> 4x = 20.',
        '💡 Dica 3: Divida 20 por 4: x = 20 / 4.'
      ],
      explanation: {
        title: 'Como resolver 4x + 6 = 26:',
        steps: [
          '1. Subtraia 6 de ambos os membros: 4x = 26 - 6  =>  4x = 20.',
          '2. Divida por 4: x = 20 / 4  =>  x = 5.',
          '3. Verificação: 4*(5) + 6 = 20 + 6 = 26.'
        ]
      }
    },
    {
      id: 'eq_m_4',
      equation: '5x - 7 = 23',
      leftDescription: '5 caixas x tirando 7kg',
      rightDescription: '23 pesos de 1kg',
      leftWeight: '5x - 7',
      rightWeight: '23',
      leftItems: [{ type: 'variable', label: '5x' }, { type: 'weight', value: -7, label: '-7' }],
      rightItems: [{ type: 'weight', value: 23, label: '23' }],
      solution: 6,
      options: [4, 5, 6, 8],
      hints: [
        '💡 Dica 1: Some 7 dos dois lados da balança.',
        '💡 Dica 2: 5x = 23 + 7 -> 5x = 30.',
        '💡 Dica 3: Divida 30 por 5.'
      ],
      explanation: {
        title: 'Como resolver 5x - 7 = 23:',
        steps: [
          '1. Somamos 7: 5x = 23 + 7  =>  5x = 30.',
          '2. Dividimos por 5: x = 30 / 5  =>  x = 6.',
          '3. Verificação: 5*(6) - 7 = 30 - 7 = 23.'
        ]
      }
    }
  ],
  dificil: [
    {
      id: 'eq_d_1',
      equation: '3x + 4 = x + 12',
      leftDescription: '3 caixas x e peso de 4kg',
      rightDescription: '1 caixa x e peso de 12kg',
      leftWeight: '3x + 4',
      rightWeight: 'x + 12',
      leftItems: [{ type: 'variable', label: '3x' }, { type: 'weight', value: 4, label: '+4' }],
      rightItems: [{ type: 'variable', label: 'x' }, { type: 'weight', value: 12, label: '+12' }],
      solution: 4,
      options: [3, 4, 6, 8],
      hints: [
        '💡 Dica 1: Há caixas "x" nos dois lados! Subtraia 1x de ambos os pratos para agrupar as incógnitas.',
        '💡 Dica 2: 3x - x + 4 = 12 -> 2x + 4 = 12.',
        '💡 Dica 3: Agora subtraia 4: 2x = 8 -> x = 4.'
      ],
      explanation: {
        title: 'Como resolver 3x + 4 = x + 12:',
        steps: [
          '1. Transponha o termo com x para a esquerda subtraindo x de ambos os lados:',
          '   3x - x + 4 = 12  =>  2x + 4 = 12',
          '2. Subtraia 4 de ambos os lados:',
          '   2x = 12 - 4  =>  2x = 8',
          '3. Divida por 2:',
          '   x = 8 / 2  =>  x = 4',
          '4. Verificação: 3*(4) + 4 = 16 | 4 + 12 = 16. Ambos os lados valem 16!'
        ]
      }
    },
    {
      id: 'eq_d_2',
      equation: '5x - 8 = 2x + 7',
      leftDescription: '5 caixas x tirando 8kg',
      rightDescription: '2 caixas x e peso de 7kg',
      leftWeight: '5x - 8',
      rightWeight: '2x + 7',
      leftItems: [{ type: 'variable', label: '5x' }, { type: 'weight', value: -8, label: '-8' }],
      rightItems: [{ type: 'variable', label: '2x' }, { type: 'weight', value: 7, label: '+7' }],
      solution: 5,
      options: [3, 4, 5, 7],
      hints: [
        '💡 Dica 1: Subtraia 2x de ambos os membros: 5x - 2x = 3x.',
        '💡 Dica 2: Some 8 a ambos os membros: 3x = 7 + 8 -> 3x = 15.',
        '💡 Dica 3: Divida 15 por 3 para isolar x.'
      ],
      explanation: {
        title: 'Como resolver 5x - 8 = 2x + 7:',
        steps: [
          '1. Subtraia 2x dos dois lados: 3x - 8 = 7.',
          '2. Some 8 aos dois lados: 3x = 7 + 8  =>  3x = 15.',
          '3. Divida por 3: x = 15 / 3  =>  x = 5.',
          '4. Verificação: 5*(5) - 8 = 17 | 2*(5) + 7 = 17. Correto!'
        ]
      }
    },
    {
      id: 'eq_d_3',
      equation: '4x + 10 = 2(x + 11)',
      leftDescription: '4 caixas x e 10kg',
      rightDescription: 'O dobro de (x + 11)',
      leftWeight: '4x + 10',
      rightWeight: '2x + 22',
      leftItems: [{ type: 'variable', label: '4x' }, { type: 'weight', value: 10, label: '+10' }],
      rightItems: [{ type: 'variable', label: '2x' }, { type: 'weight', value: 22, label: '+22' }],
      solution: 6,
      options: [4, 5, 6, 9],
      hints: [
        '💡 Dica 1: Aplique a propriedade distributiva à direita: 2*(x + 11) = 2x + 22.',
        '💡 Dica 2: Temos 4x + 10 = 2x + 22. Subtraia 2x dos dois lados: 2x + 10 = 22.',
        '💡 Dica 3: Subtraia 10 (2x = 12) e divida por 2 (x = 6).'
      ],
      explanation: {
        title: 'Como resolver 4x + 10 = 2(x + 11):',
        steps: [
          '1. Aplicar a distributiva no membro direito: 2 * x + 2 * 11 = 2x + 22.',
          '2. Equação: 4x + 10 = 2x + 22.',
          '3. Subtraia 2x de ambos os lados: 2x + 10 = 22.',
          '4. Subtraia 10: 2x = 12.',
          '5. Divida por 2: x = 6.',
          '6. Verificação: 4*(6) + 10 = 34 | 2*(6 + 11) = 2*17 = 34.'
        ]
      }
    }
  ]
};

const FRACTIONS_BANK = {
  facil: [
    {
      id: 'fr_f_1',
      prompt: 'Qual fração representa a parte colorida desta pizza?',
      visualType: 'pizza',
      visualData: {
        totalSlices: 4,
        coloredSlices: 3,
        primaryColor: '#F59E0B'
      },
      solution: '3/4',
      options: ['1/4', '2/4', '3/4', '4/3'],
      hints: [
        '💡 Dica 1: Conte quantas fatias a pizza inteira tem no total (esse é o Denominador).',
        '💡 Dica 2: Conte quantas fatias estão coloridas em destaque (esse é o Numerador).',
        '💡 Dica 3: A fração é formada por (Partes Coloridas) / (Total de Partes).'
      ],
      explanation: {
        title: 'Entendendo a Fração 3/4:',
        steps: [
          '1. O círculo foi dividido em 4 fatias iguais. Portanto, o denominador é 4.',
          '2. Das 4 partes iguais, 3 estão coloridas de amarelo. Portanto, o numerador é 3.',
          '3. Fração = 3/4 (lê-se três quartos). Em porcentagem equivale a 75%!'
        ]
      }
    },
    {
      id: 'fr_f_2',
      prompt: 'Observe a barra de chocolate dividida. Qual fração está destacada?',
      visualType: 'bar',
      visualData: {
        totalUnits: 5,
        coloredUnits: 2,
        primaryColor: '#3B82F6'
      },
      solution: '2/5',
      options: ['2/5', '3/5', '1/5', '2/3'],
      hints: [
        '💡 Dica 1: A barra inteira foi particionada em 5 pedaços iguais.',
        '💡 Dica 2: Existem 2 pedaços coloridos em azul.',
        '💡 Dica 3: Numerador = 2, Denominador = 5.'
      ],
      explanation: {
        title: 'Entendendo a Fração 2/5:',
        steps: [
          '1. Total de divisões da barra = 5 (Denominador).',
          '2. Pedaços coloridos = 2 (Numerador).',
          '3. Representação fracionária: 2/5 (dois quintos).',
          '4. Equivalência decimal: 2 / 5 = 0,40 = 40% da barra!'
        ]
      }
    },
    {
      id: 'fr_f_3',
      prompt: 'Qual fração é EQUIVALENTE a 1/2 (metade)?',
      visualType: 'comparison',
      visualData: {
        referenceFraction: '1/2',
        targetSlice: 4,
        targetNumerator: 2
      },
      solution: '2/4',
      options: ['1/3', '2/4', '3/5', '2/6'],
      hints: [
        '💡 Dica 1: Frações equivalentes representam a mesma porção do todo.',
        '💡 Dica 2: Se multiplicarmos o numerador (1) e o denominador (2) pelo mesmo número (2)...',
        '💡 Dica 3: 1*2 / 2*2 = ?'
      ],
      explanation: {
        title: 'Frações Equivalentes:',
        steps: [
          '1. 1/2 representa exatamente metade de um todo (50%).',
          '2. Multiplicando numerador e denominador por 2: (1 × 2) / (2 × 2) = 2/4.',
          '3. 2 pedaços de uma pizza dividida em 4 representam a mesma quantidade que 1 pedaço de uma pizza dividida em 2!'
        ]
      }
    },
    {
      id: 'fr_f_4',
      prompt: 'Quanto representa 1/4 em forma de Porcentagem (%)?',
      visualType: 'percentage_card',
      visualData: {
        fraction: '1/4',
        denominator: 4
      },
      solution: '25%',
      options: ['15%', '20%', '25%', '40%'],
      hints: [
        '💡 Dica 1: O "todo" completo em porcentagem é 100%.',
        '💡 Dica 2: Divida 100% pelo denominador da fração (4).',
        '💡 Dica 3: 100 dividido por 4 = ?'
      ],
      explanation: {
        title: 'Convertendo 1/4 em Porcentagem:',
        steps: [
          '1. Para transformar uma fração em porcentagem, podemos multiplicar por 100%.',
          '2. (1 / 4) * 100% = 100% / 4.',
          '3. 100 ÷ 4 = 25%. Logo, 1/4 é igual a 25%.'
        ]
      }
    }
  ],
  medio: [
    {
      id: 'fr_m_1',
      prompt: 'Qual é o resultado da soma de frações: 2/7 + 3/7?',
      visualType: 'bar',
      visualData: {
        totalUnits: 7,
        coloredUnits: 5,
        primaryColor: '#10B981'
      },
      solution: '5/7',
      options: ['5/14', '5/7', '6/7', '1/7'],
      hints: [
        '💡 Dica 1: Como os denominadores são iguais (ambos são 7), nós MANTEMOS o denominador.',
        '💡 Dica 2: Somamos apenas os numeradores: 2 + 3.',
        '💡 Dica 3: Resultado: (2 + 3) / 7.'
      ],
      explanation: {
        title: 'Soma de Frações com Mesmo Denominador:',
        steps: [
          '1. Quando as partes divididas são do mesmo tamanho (mesmo denominador 7), mantemos a base.',
          '2. Somamos os numeradores: 2 + 3 = 5.',
          '3. Resposta correta: 5/7.',
          '4. Cuidado: NUNCA somamos os denominadores (7+7=14 está incorreto!).'
        ]
      }
    },
    {
      id: 'fr_m_2',
      prompt: 'Qual é a forma IRREDUTÍVEL (simplificada) da fração 6/8?',
      visualType: 'pizza',
      visualData: {
        totalSlices: 8,
        coloredSlices: 6,
        primaryColor: '#8B5CF6'
      },
      solution: '3/4',
      options: ['2/3', '3/4', '4/5', '1/2'],
      hints: [
        '💡 Dica 1: Para simplificar, divida o numerador (6) e o denominador (8) pelo maior divisor comum.',
        '💡 Dica 2: Ambos são números pares, logo podem ser divididos por 2.',
        '💡 Dica 3: 6 ÷ 2 = 3 e 8 ÷ 2 = 4.'
      ],
      explanation: {
        title: 'Simplificação de 6/8:',
        steps: [
          '1. Encontramos o MDC (Máximo Divisor Comum) entre 6 e 8, que é 2.',
          '2. Dividimos cima e baixo por 2:',
          '   (6 ÷ 2) / (8 ÷ 2) = 3/4',
          '3. Como 3 e 4 não possuem outro divisor comum além de 1, a fração 3/4 é irredutível.'
        ]
      }
    },
    {
      id: 'fr_m_3',
      prompt: 'Qual porcentagem equivale à fração 3/5?',
      visualType: 'bar',
      visualData: {
        totalUnits: 5,
        coloredUnits: 3,
        primaryColor: '#EC4899'
      },
      solution: '60%',
      options: ['30%', '50%', '60%', '75%'],
      hints: [
        '💡 Dica 1: Multiplique numerador e denominador por 20 para que a base fique 100.',
        '💡 Dica 2: 3 * 20 = 60 e 5 * 20 = 100 -> 60/100.',
        '💡 Dica 3: 60/100 é lido diretamente como 60%.'
      ],
      explanation: {
        title: 'Convertendo 3/5 para %:',
        steps: [
          '1. Uma porcentagem é uma fração de base 100.',
          '2. Para transformar o denominador 5 em 100, multiplicamos por 20:',
          '   (3 × 20) / (5 × 20) = 60/100',
          '3. 60 sobre 100 = 60%.'
        ]
      }
    },
    {
      id: 'fr_m_4',
      prompt: 'Qual fração é MAIOR: 3/4 ou 2/3?',
      visualType: 'comparison',
      visualData: {
        fractionA: '3/4 (75%)',
        fractionB: '2/3 (66,6%)'
      },
      solution: '3/4',
      options: ['3/4', '2/3', 'São iguais', 'Não é possível comparar'],
      hints: [
        '💡 Dica 1: Converta em decimais ou use o MMC para comparar.',
        '💡 Dica 2: 3/4 = 0,75 (75%) e 2/3 = 0,666... (66,6%).',
        '💡 Dica 3: 0,75 é maior do que 0,66.'
      ],
      explanation: {
        title: 'Comparando 3/4 e 2/3:',
        steps: [
          '1. Multiplicando cruzado: 3 × 3 = 9 e 4 × 2 = 8.',
          '2. Como 9 > 8, a fração 3/4 é maior do que 2/3.',
          '3. Em porcentagem: 3/4 equivale a 75% enquanto 2/3 equivale a ~66,6%.'
        ]
      }
    }
  ],
  dificil: [
    {
      id: 'fr_d_1',
      prompt: 'Calcule a soma com denominadores diferentes: 1/2 + 1/3 = ?',
      visualType: 'bar',
      visualData: {
        totalUnits: 6,
        coloredUnits: 5,
        primaryColor: '#F59E0B'
      },
      solution: '5/6',
      options: ['2/5', '5/6', '3/6', '7/6'],
      hints: [
        '💡 Dica 1: Denominadores diferentes (2 e 3). Devemos encontrar o MMC entre 2 e 3 (que é 6).',
        '💡 Dica 2: 1/2 vira 3/6 e 1/3 vira 2/6.',
        '💡 Dica 3: Agora some os numeradores: 3/6 + 2/6 = ?'
      ],
      explanation: {
        title: 'Soma de 1/2 + 1/3:',
        steps: [
          '1. O MMC entre 2 e 3 é 6.',
          '2. Frações equivalentes com denominador 6:',
          '   1/2 = 3/6',
          '   1/3 = 2/6',
          '3. Somando: 3/6 + 2/6 = 5/6.',
          '4. Resposta correta: 5/6!'
        ]
      }
    },
    {
      id: 'fr_d_2',
      prompt: 'Em uma sala com 40 alunos, 35% gostam de Geometria. Quantos alunos são?',
      visualType: 'percentage_card',
      visualData: {
        total: 40,
        percentage: 35
      },
      solution: '14',
      options: ['12', '14', '16', '18'],
      hints: [
        '💡 Dica 1: 35% de 40 significa calcular (35 / 100) * 40.',
        '💡 Dica 2: 10% de 40 = 4 alunos. Portanto 30% = 3 * 4 = 12 alunos.',
        '💡 Dica 3: 5% é metade de 10% (metade de 4 é 2). Então 12 + 2 = ?'
      ],
      explanation: {
        title: 'Cálculo de 35% de 40:',
        steps: [
          '1. Método rápido por decomposição:',
          '   10% de 40 = 4',
          '   30% de 40 = 4 × 3 = 12',
          '   5% de 40 = 2',
          '   35% = 12 + 2 = 14 alunos.',
          '2. Método fracionário: (35 × 40) / 100 = 1400 / 100 = 14.'
        ]
      }
    },
    {
      id: 'fr_d_3',
      prompt: 'Qual é o resultado da multiplicação: (2/3) × (3/5)?',
      visualType: 'bar',
      visualData: {
        totalUnits: 5,
        coloredUnits: 2,
        primaryColor: '#6366F1'
      },
      solution: '2/5',
      options: ['5/8', '2/5', '6/8', '1/3'],
      hints: [
        '💡 Dica 1: Na multiplicação de frações, multiplica-se numerador por numerador e denominador por denominador.',
        '💡 Dica 2: (2 × 3) / (3 × 5) = 6/15.',
        '💡 Dica 3: Simplifique 6/15 dividindo por 3.'
      ],
      explanation: {
        title: 'Multiplicação de Frações:',
        steps: [
          '1. Multiplica-se numerador com numerador: 2 × 3 = 6.',
          '2. Multiplica-se denominador com denominador: 3 × 5 = 15.',
          '3. Fração obtida: 6/15.',
          '4. Simplificando por 3: (6 ÷ 3) / (15 ÷ 3) = 2/5.'
        ]
      }
    }
  ]
};

/**
 * Busca conjunto de questões do jogo selecionado
 */
function getQuestions(req, res) {
  try {
    const { gameType, difficulty = 'facil' } = req.query;

    if (!gameType || !['equacoes', 'fracoes'].includes(gameType)) {
      return res.status(400).json({ error: 'Tipo de jogo inválido. Use "equacoes" ou "fracoes".' });
    }

    const diffKey = ['facil', 'medio', 'dificil'].includes(difficulty) ? difficulty : 'facil';

    let questions = [];
    if (gameType === 'equacoes') {
      questions = EQUATIONS_BANK[diffKey] || EQUATIONS_BANK.facil;
    } else {
      questions = FRACTIONS_BANK[diffKey] || FRACTIONS_BANK.facil;
    }

    // Embaralha levemente para variedade
    const shuffled = [...questions].sort(() => Math.random() - 0.5);

    return res.json({
      gameType,
      difficulty: diffKey,
      totalQuestions: shuffled.length,
      questions: shuffled
    });
  } catch (error) {
    console.error('Erro ao obter questões:', error);
    return res.status(500).json({ error: 'Erro ao carregar questões.' });
  }
}

/**
 * Salva a sessão de jogo e computa gamificação (XP, Nível, Insígnias e Trilha)
 */
function saveSession(req, res) {
  try {
    const userId = req.user.id;
    const {
      gameType,
      score = 0,
      correctAnswers = 0,
      wrongAnswers = 0,
      difficulty = 'facil',
      durationSeconds = 0,
      stageId = null
    } = req.body;

    if (!gameType) {
      return res.status(400).json({ error: 'gameType é obrigatório.' });
    }

    const totalQuestions = correctAnswers + wrongAnswers;
    const accuracy = totalQuestions > 0 ? Number((correctAnswers / totalQuestions).toFixed(2)) : 0.0;

    // Cálculo de XP ganho: base pelo score + bônus de precisão
    const difficultyMultiplier = difficulty === 'dificil' ? 1.5 : difficulty === 'medio' ? 1.2 : 1.0;
    const xpEarned = Math.round((score * 0.4 + correctAnswers * 15) * difficultyMultiplier);
    const coinsEarned = Math.round(correctAnswers * 5 + (accuracy === 1.0 ? 20 : 5));

    // 1. Inserir no histórico de sessões
    const insertSession = db.prepare(`
      INSERT INTO game_sessions (user_id, game_type, score, correct_answers, wrong_answers, accuracy, difficulty, xp_earned, duration_seconds)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertSession.run(userId, gameType, score, correctAnswers, wrongAnswers, accuracy, difficulty, xpEarned, durationSeconds);

    // 2. Atualizar XP, Moedas e Nível do Usuário
    const currentUser = db.prepare('SELECT xp, level, coins FROM users WHERE id = ?').get(userId);
    const newXp = (currentUser.xp || 0) + xpEarned;
    const newCoins = (currentUser.coins || 0) + coinsEarned;

    // Fórmula de Nível: a cada 150 XP ganha 1 nível
    const newLevel = Math.max(1, Math.floor(newXp / 150) + 1);
    const didLevelUp = newLevel > currentUser.level;

    db.prepare(`
      UPDATE users
      SET xp = ?, level = ?, coins = ?
      WHERE id = ?
    `).run(newXp, newLevel, newCoins, userId);

    // 3. Atualizar progresso na Trilha de Fases (se jogado pelo modo trilha)
    let trackUpdate = null;
    if (stageId) {
      const numericStage = Number(stageId);
      // Estrelas: 3 estrelas (100% de acerto), 2 estrelas (>= 70%), 1 estrela (concluiu)
      let stars = 1;
      if (accuracy >= 1.0) stars = 3;
      else if (accuracy >= 0.7) stars = 2;

      const existingStage = db.prepare('SELECT stars, best_score FROM learning_track WHERE user_id = ? AND stage_id = ?').get(userId, numericStage);

      const bestStars = existingStage ? Math.max(existingStage.stars, stars) : stars;
      const bestScore = existingStage ? Math.max(existingStage.best_score, score) : score;

      db.prepare(`
        INSERT OR REPLACE INTO learning_track (user_id, stage_id, stars, status, best_score, updated_at)
        VALUES (?, ?, ?, 'completed', ?, CURRENT_TIMESTAMP)
      `).run(userId, numericStage, bestStars, bestScore);

      // Desbloqueia a próxima fase da trilha
      const nextStage = numericStage + 1;
      if (nextStage <= 6) {
        const nextStageData = db.prepare('SELECT status FROM learning_track WHERE user_id = ? AND stage_id = ?').get(userId, nextStage);
        if (!nextStageData || nextStageData.status === 'locked') {
          db.prepare(`
            INSERT OR REPLACE INTO learning_track (user_id, stage_id, stars, status, best_score, updated_at)
            VALUES (?, ?, 0, 'unlocked', 0, CURRENT_TIMESTAMP)
          `).run(userId, nextStage);
        }
      }

      trackUpdate = {
        stageId: numericStage,
        starsAwarded: stars,
        nextStageUnlocked: nextStage <= 6 ? nextStage : null
      };
    }

    // 4. Verificação de Desbloqueio de Insígnias / Medalhas
    const newlyUnlockedBadges = [];

    // Busca estatísticas agregadas do usuário
    const totalSessions = db.prepare('SELECT COUNT(*) as count FROM game_sessions WHERE user_id = ?').get(userId).count;
    const eqStats = db.prepare("SELECT SUM(correct_answers) as sum FROM game_sessions WHERE user_id = ? AND game_type = 'equacoes'").get(userId);
    const frStats = db.prepare("SELECT SUM(correct_answers) as sum FROM game_sessions WHERE user_id = ? AND game_type = 'fracoes'").get(userId);

    const totalEqCorrect = eqStats.sum || 0;
    const totalFrCorrect = frStats.sum || 0;

    // Todas as insígnias disponíveis que o usuário ainda não possui
    const availableBadges = db.prepare(`
      SELECT b.* FROM badges b
      WHERE b.id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = ?)
    `).all(userId);

    const unlockBadge = db.prepare(`
      INSERT OR IGNORE INTO user_badges (user_id, badge_id)
      VALUES (?, ?)
    `);

    for (const b of availableBadges) {
      let shouldUnlock = false;

      if (b.req_type === 'total_games' && totalSessions >= b.req_val) shouldUnlock = true;
      if (b.req_type === 'equacoes_correct' && totalEqCorrect >= b.req_val) shouldUnlock = true;
      if (b.req_type === 'fracoes_correct' && totalFrCorrect >= b.req_val) shouldUnlock = true;
      if (b.req_type === 'perfect_accuracy' && accuracy === 1.0 && score > 0) shouldUnlock = true;
      if (b.req_type === 'speed_run' && durationSeconds > 0 && durationSeconds <= b.req_val && score >= 100) shouldUnlock = true;
      if (b.req_type === 'reach_level' && newLevel >= b.req_val) shouldUnlock = true;

      if (shouldUnlock) {
        unlockBadge.run(userId, b.id);
        newlyUnlockedBadges.push(b);
      }
    }

    return res.json({
      message: 'Sessão de jogo salva com sucesso!',
      xpEarned,
      coinsEarned,
      totalXp: newXp,
      level: newLevel,
      didLevelUp,
      accuracy,
      score,
      newBadges: newlyUnlockedBadges,
      trackUpdate
    });
  } catch (error) {
    console.error('Erro ao salvar sessão de jogo:', error);
    return res.status(500).json({ error: 'Erro interno ao salvar pontuação.' });
  }
}

module.exports = {
  getQuestions,
  saveSession
};
