from flask import Flask, request, jsonify
from flask_cors import CORS
from postalCodeModel import PostalCode
from postalCodeModel import infoPostalCodes
from connectionDB import create_app
from generateRule import generateRuleForPostalCodes
import re
from compilador import *

app, db = create_app()
CORS(app)

paises = {
    "AD": "Andorra",
    "AR": "Argentina",
    "AS": "Samoa Americana",
    "AT": "Austria",
    "AU": "Australia",
    "AX": "Islas Åland",
    "AZ": "Azerbaiyán",
    "BD": "Bangladesh",
    "BE": "Bélgica",
    "BG": "Bulgaria",
    "BM": "Bermudas",
    "BR": "Brasil",
    "BY": "Bielorrusia",
    "CA": "Canadá",
    "CH": "Suiza",
    "CL": "Chile",
    "CO": "Colombia",
    "CR": "Costa Rica",
    "CY": "Chipre",
    "CZ": "República Checa",
    "DE": "Alemania",
    "DK": "Dinamarca",
    "DO": "República Dominicana",
    "DZ": "Argelia",
    "EE": "Estonia",
    "ES": "España",
    "FI": "Finlandia",
    "FM": "Micronesia",
    "FO": "Islas Feroe",
    "FR": "Francia",
    "GB": "Reino Unido",
    "GF": "Guayana Francesa",
    "GG": "Guernsey",
    "GL": "Groenlandia",
    "GP": "Guadalupe",
    "GT": "Guatemala",
    "GU": "Guam",
    "HR": "Croacia",
    "HT": "Haití",
    "HU": "Hungría",
    "IE": "Irlanda",
    "IM": "Isla de Man",
    "IN": "India",
    "IS": "Islandia",
    "IT": "Italia",
    "JE": "Jersey",
    "JP": "Japón",
    "KR": "Corea del Sur",
    "LI": "Liechtenstein",
    "LK": "Sri Lanka",
    "LT": "Lituania",
    "LU": "Luxemburgo",
    "LV": "Letonia",
    "MA": "Marruecos",
    "MC": "Mónaco",
    "MD": "Moldavia",
    "MH": "Islas Marshall",
    "MK": "Macedonia del Norte",
    "MP": "Islas Marianas del Norte",
    "MQ": "Martinica",
    "MT": "Malta",
    "MW": "Malaui",
    "MX": "México",
    "MY": "Malasia",
    "NC": "Nueva Caledonia",
    "NL": "Países Bajos",
    "NO": "Noruega",
    "NZ": "Nueva Zelanda",
    "PE": "Perú",
    "PH": "Filipinas",
    "PK": "Pakistán",
    "PL": "Polonia",
    "PM": "San Pedro y Miquelón",
    "PR": "Puerto Rico",
    "PT": "Portugal",
    "PW": "Palaos",
    "RE": "Reunión",
    "RO": "Rumania",
    "RS": "Serbia",
    "RU": "Rusia",
    "SE": "Suecia",
    "SG": "Singapur",
    "SI": "Eslovenia",
    "SJ": "Svalbard y Jan Mayen",
    "SK": "Eslovaquia",
    "SM": "San Marino",
    "TH": "Tailandia",
    "TR": "Turquía",
    "UA": "Ucrania",
    "US": "Estados Unidos",
    "UY": "Uruguay",
    "VA": "Ciudad del Vaticano",
    "VI": "Islas Vírgenes de los Estados Unidos",
    "WF": "Wallis y Futuna",
    "YT": "Mayotte",
    "ZA": "Sudáfrica"
}


@app.route('/generatePostalCode/<country_code>', methods=['GET'])
def get_er_postalCode(country_code):
    if request.method == 'GET':

        postal_codes = PostalCode.query.filter_by(
            country_code=country_code).all()

        re, rule = generateRuleForPostalCodes(
            [p.postal_code for p in postal_codes])

        return jsonify(re, rule)


@app.route('/generateAllPostalCodes', methods=['GET'])
def get_all_er_postalCode():
    if request.method == 'GET':
        res = {}

        country_codes = PostalCode.query.with_entities(
            PostalCode.country_code).group_by(PostalCode.country_code).all()

        for cc in country_codes:
            postal_codes = PostalCode.query.filter_by(country_code=cc[0]).all()
            er, rule = generateRuleForPostalCodes(
                [p.postal_code for p in postal_codes])

            res[cc[0]] = {"er": er, "rule": rule}

            data = infoPostalCodes.query.filter_by(country_code=cc[0]).first()

            if (data):
                data.er = er
                data.rule = rule
                data.name = paises[cc[0]]
                db.session.commit()
            else:
                newInfo = infoPostalCodes(
                    country_code=cc[0], er=er, rule=rule, name=paises[cc[0]])
                db.session.add(newInfo)
                db.session.commit()

        return jsonify(res)


@app.route('/postalCodeGet/<code>', methods=['GET'])
def postalCodeGet(code=None):
    if request.method == 'GET':
        postalCodes = PostalCode.query.filter_by(postal_code=code).all()
        if postalCodes:
            postalCodes_list = [postalCode.as_dict()
                                for postalCode in postalCodes]
            return jsonify(postalCodes_list)
        else:
            return jsonify({"message": "Postal Code not found"})


@app.route('/validateCode/<code>', methods=['get'])
def validateCode(code=None):
    if request.method == 'GET':
        countrys = {}
        ers = infoPostalCodes.query.all()

        for er in ers:
            if re.match(er.er, code):
                countrys[er.country_code] = {
                    "name": er.name, "er": er.er, "rule": er.rule}

        if countrys:
            return jsonify(countrys)
        else:
            return jsonify({"message": "Code is not valid"})


@app.route('/validateLexical', methods=['post'])
def validateLexico():
    if request.method == "POST":
        code = request.json['code']
        isOkLexico, msg = analisisLexico(code)
        return jsonify({"isOkLexico": isOkLexico, "msg": msg})


@app.route('/validateSemantic', methods=['post'])
def validateSemantico():
    if request.method == "POST":
        code = request.json['code']
        isOkSemantico, msg = analisisSemantico(code)
        return jsonify({"isOkSemantico": isOkSemantico, "msg": msg})


@app.route('/validateStructural', methods=['post'])
def validateStructural():
    if request.method == "POST":
        code = request.json['code']
        isOkEstructural, msg = analisisEstructural(code)
        return jsonify({"isOkEstructural": isOkEstructural, "msg": msg})


@app.route('/createNewRule', methods=['post'])
def createNewRule():
    if request.method == "POST":
        code = request.json['code']
        countryCode = request.json['countryCode']
        countryName = request.json['countryName']

        isOkLexico, msg = analisisLexico(code)
        if not isOkLexico:
            return jsonify({"isOkLexico": isOkLexico, "msg": msg})

        isOkSemantico, msg = analisisSemantico(code)
        if not isOkSemantico:
            return jsonify({"isOkSemantico": isOkSemantico, "msg": msg})

        isOkEstructural, msg = analisisEstructural(code)
        if not isOkEstructural:
            return jsonify({"isOkEstructural": isOkEstructural, "msg": msg})

        er, rule = generateER(code)

        data = infoPostalCodes.query.filter_by(
            country_code=countryCode).first()

        if (data):
            data.er = er
            data.rule = rule
            data.name = countryName
            db.session.commit()
            msg = "Update rule for " + countryName

        else:
            newInfo = infoPostalCodes(
                country_code=countryCode, er=er, rule=rule, name=countryName)
            db.session.add(newInfo)
            db.session.commit()
            msg = "Added new rule for " + countryName

        return jsonify({"isOkLexico": isOkLexico, "isOkSemantico": isOkSemantico, "isOkEstructural": isOkEstructural, "msg": msg, "er": er, "rule": rule})


@app.route('/createNewRule2', methods=['post'])
def createNewRule2():
    if request.method == "POST":
        codes = request.json['codes'].split("\n")
        countryCode = request.json['countryCode']
        countryName = request.json['countryName']

        er, rule = generateRuleForPostalCodes(codes)

        data = infoPostalCodes.query.filter_by(
            country_code=countryCode).first()

        if (data):
            data.er = er
            data.rule = rule
            data.name = countryName
            db.session.commit()
            msg = "Update rule for " + countryName

        else:
            newInfo = infoPostalCodes(
                country_code=countryCode, er=er, rule=rule, name=countryName)
            db.session.add(newInfo)
            db.session.commit()
            msg = "Added new rule for " + countryName

        return jsonify({"msg": msg, "er": er, "rule": rule})


@app.route('/getRules', methods=['get'])
def getRules():
    if request.method == 'GET':
        ers = infoPostalCodes.query.all()

        inf = [er.as_dict() for er in ers]

        return jsonify(inf)


if __name__ == '__main__':
    app.run(debug=True)
