palabrasReservadas = {"N": "The character is a number", "L": "The character is a letter", "C": "The character can be a number or a letter", "-": "The character is a hyphen ",
                      "_": "Character is a blank space", "(": "Character starts optionality", ")?": "Character ends optionality"}


def analisisLexico(codigo):
    codCar = codigo.split(" ")
    isOkLexico = True
    msg = ""

    for cod in codCar:
        if cod not in palabrasReservadas:
            isOkLexico = False
            msg = "Lexical error in " + cod
            break

    return isOkLexico, msg


def analisisSemantico(codigo):
    codCar = codigo.split(" ")
    isOkSemantico = True
    msg = ""

    for cod in codCar:
        if cod not in palabrasReservadas:
            isOkSemantico = False
            msg += "Semantic error in " + cod
            break
        else:
            msg += palabrasReservadas[cod] + " <br/> "

    return isOkSemantico, msg


def analisisEstructural(codigo):
    precaracter = False
    isOkEstructural = True
    contOpcionalidad = 0
    cont = 0
    msg = ""

    caracter = codigo.split(" ")

    for car in caracter:

        if car == "-" or car == "_":
            if not precaracter:
                isOkEstructural = False
                msg = "Structural error in " + car + \
                    ", a valid letter is needed before the character - or _"
                break

        if car == "(":
            contOpcionalidad += 1
        elif car == ")?":
            contOpcionalidad -= 1
            if contOpcionalidad < 0:
                isOkEstructural = False
                msg = "Structural error in " + car + ", there are more characters )? that ("
                break

        if car == "C" or car == "N" or car == "L" or car == "(" or car == ")?":
            precaracter = True
        elif car == "-" or car == "_":
            precaracter = False

        cont += 1

    if contOpcionalidad != 0:
        isOkEstructural = False
        msg = "Structural error in " + car + ", there are more characters ( that )?"

    if not precaracter:
        isOkEstructural = False
        msg = "Structural error in " + car + \
            ", a valid letter is needed after the character - or _"
        
    if not isOkEstructural:
        msg += ", in the position " + str(cont)

    return isOkEstructural,msg

def generateER(codigo):
    
    caracter = codigo.split(" ")
    er = "^"
    rule = ""

    for car in caracter:
        if car == "N":
            er += "[0-9]"
            rule += "N"
        elif car == "L":
            er += "[A-Z]"
            rule += "L"
        elif car == "C":
            er += "[A-Z0-9]"
            rule += "C"
        elif car == "-":
            er += "-"
            rule += "-"
        elif car == "_":
            er += " "
            rule += "_"
        elif car == "(":
            er += "("
            rule += "("
        elif car == ")?":
            er += ")?"
            rule += ")?"

    er += "$"
        
    return er,rule
