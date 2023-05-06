import re


def getPart(letter, last, contLast, p, optional, end, sintaxis):

    response = ''

    if (last == letter and not p):
        response = ''
        contLast += 1
        sintaxis += letter

    if (contLast > 1 and (last != letter or end)):
        response = '{' + str(contLast) + '}'
        contLast = 1

    if (p and not optional):
        response += '('
        last = '('
        optional = True
        p = False
        sintaxis += 'P'

    if (letter == 'L' and letter != last):  # Letter
        response += '[A-Z]'
        sintaxis += letter
    elif (letter == 'N' and letter != last):  # Number
        response += '[0-9]'
        sintaxis += letter
    elif (letter == 'C' and letter != last):  # Combination Letter and Number
        response += '[A-Z0-9]'
        sintaxis += letter
    elif (letter == '-' or letter == ' '):
        response += letter
        sintaxis += letter

    if (optional):
        response += ')?'
        last = ')?'
        optional = False
        p = False
        sintaxis += 'PI'

    if (last != '(' or last != ')?'):
        last = letter

    return response, last, contLast, p, optional, sintaxis


def generateRuleForPostalCodes(postalCodes=[]):
    sintaxis = ''
    last = ''
    contLast = 1
    optional = False
    p = False

    er = '^'
    rule = ''

    size = len(max(postalCodes, key=len))

    for contWord in range(size):
        # if True:
        # contWord = 1
        part = ''
        for postalCode in postalCodes:
            if (len(postalCode) <= contWord):
                p = True

            if (len(postalCode) > contWord):
                if (re.match('[0-9]', postalCode[contWord]) and part != 'C'):
                    if (part == 'L'):
                        part = 'C'
                    else:
                        part = 'N'
                elif (re.match('[A-Z]', postalCode[contWord]) and part != 'C'):
                    if (part == 'N'):
                        part = 'C'
                    else:
                        part = 'L'

                if (postalCode[contWord] == ' ' or postalCode[contWord] == '-'):
                    part = postalCode[contWord]

            if (contWord == size):
                p = True
                optional = True

        erAux, last, contLast, p, optional, sintaxis = getPart(
            part, last, contLast, p, optional, (contWord+1 == size), sintaxis)

        er += erAux
    er += '$'

    """
    print(rule)
    print(er)
    print(sintaxis)

    contTrue = 0
    contFalse = 0
    total = 0
    for postalCode in postalCodes:
        if re.match(er, postalCode):
            contTrue += 1
        else:
            contFalse += 1

        total += 1

    print("True: "+str(contTrue) + " | False: " +
          str(contFalse) + " | Total: " + str(total))
    """
    return er, sintaxis
