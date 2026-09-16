from backend.document_ai.mrz.parser import MRZParser


def main():
    mrz = """P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<
L898902C36UTO7408122F1204159ZE184226B<<<<<10"""

    parser = MRZParser()
    result = parser.parse(mrz)

    print("\n==============================")
    print("        MRZ PARSER TEST")
    print("==============================\n")

    for key, value in result.items():
        print(f"{key}: {value}")


if __name__ == "__main__":
    main()