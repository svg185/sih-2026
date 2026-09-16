class MRZValidator:
    """
    ICAO TD3 Passport MRZ Check-Digit Validator.
    """

    WEIGHTS = [7, 3, 1]

    def _char_value(self, char: str) -> int:
        if char == "<":
            return 0

        if char.isdigit():
            return int(char)

        if "A" <= char <= "Z":
            return ord(char) - ord("A") + 10

        return 0

    def calculate_check_digit(self, value: str) -> str:
        total = 0

        for index, char in enumerate(value):
            total += (
                self._char_value(char)
                * self.WEIGHTS[index % 3]
            )

        return str(total % 10)

    def validate_field(self, value: str, check_digit: str) -> bool:
        if len(check_digit) != 1 or not check_digit.isdigit():
            return False

        return self.calculate_check_digit(value) == check_digit

    def validate(self, mrz_text: str) -> dict:
        lines = [
            line.strip().upper()
            for line in mrz_text.splitlines()
            if line.strip()
        ]

        if len(lines) != 2:
            return {
                "valid": False,
                "error": "TD3 passport requires exactly 2 MRZ lines"
            }

        line1 = lines[0]
        line2 = lines[1]

        if len(line1) != 44 or len(line2) != 44:
            return {
                "valid": False,
                "error": "Each MRZ line must contain 44 characters"
            }

        if not line1.startswith("P<"):
            return {
                "valid": False,
                "error": "Invalid passport MRZ document type"
            }

        passport_number = line2[0:9]
        passport_check = line2[9]

        date_of_birth = line2[13:19]
        birth_check = line2[19]

        date_of_expiry = line2[21:27]
        expiry_check = line2[27]

        personal_number = line2[28:42]
        personal_check = line2[42]

        composite_data = (
            passport_number
            + passport_check
            + date_of_birth
            + birth_check
            + date_of_expiry
            + expiry_check
            + personal_number
            + personal_check
        )

        composite_check = line2[43]

        passport_valid = self.validate_field(
            passport_number,
            passport_check
        )

        birth_valid = self.validate_field(
            date_of_birth,
            birth_check
        )

        expiry_valid = self.validate_field(
            date_of_expiry,
            expiry_check
        )

        personal_valid = self.validate_field(
            personal_number,
            personal_check
        )

        composite_valid = self.validate_field(
            composite_data,
            composite_check
        )

        overall_valid = (
            passport_valid
            and birth_valid
            and expiry_valid
            and personal_valid
            and composite_valid
        )

        return {
            "valid": overall_valid,
            "passport_number_check": passport_valid,
            "date_of_birth_check": birth_valid,
            "date_of_expiry_check": expiry_valid,
            "personal_number_check": personal_valid,
            "composite_check": composite_valid,
        }