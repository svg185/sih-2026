from backend.document_ai.mrz.parser import MRZParser
from backend.document_ai.mrz.validator import MRZValidator


def main():
    mrz = """P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<
L898902C36UTO7408122F1204159ZE184226B<<<<<10"""

    # -------------------------
    # MRZ PARSER
    # -------------------------
    parser = MRZParser()
    parsed_result = parser.parse(mrz)

    print("\n==============================")
    print("        MRZ PARSER TEST")
    print("==============================\n")

    for key, value in parsed_result.items():
        print(f"{key}: {value}")

    # -------------------------
    # MRZ VALIDATOR
    # -------------------------
    validator = MRZValidator()
    validation_result = validator.validate(mrz)

    print("\n==============================")
    print("       MRZ VALIDATION")
    print("==============================\n")

    for key, value in validation_result.items():
        print(f"{key}: {value}")


if __name__ == "__main__":
    main()