import re
from typing import Dict, Optional


class MRZParser:
    """
    Basic ICAO TD3 passport MRZ parser.
    Expects two MRZ lines of 44 characters each.
    """

    def parse(self, mrz_text: str) -> Dict:
        lines = self._clean_lines(mrz_text)

        if len(lines) < 2:
            return {
                "valid": False,
                "error": "Two MRZ lines required"
            }

        line1 = lines[-2]
        line2 = lines[-1]

        if len(line1) != 44 or len(line2) != 44:
            return {
                "valid": False,
                "error": "Invalid TD3 MRZ length"
            }

        if not line1.startswith("P<"):
            return {
                "valid": False,
                "error": "Not a passport TD3 MRZ"
            }

        surname, given_names = self._parse_name(line1[5:44])

        return {
            "valid": True,
            "document_type": "Passport",
            "issuing_country": line1[2:5],
            "surname": surname,
            "given_names": given_names,
            "passport_number": line2[0:9].replace("<", ""),
            "nationality": line2[10:13],
            "date_of_birth": line2[13:19],
            "sex": line2[20],
            "date_of_expiry": line2[21:27],
            "personal_number": line2[28:42].replace("<", ""),
        }

    def _clean_lines(self, text: str):
        lines = []

        for line in text.upper().splitlines():
            line = re.sub(r"[^A-Z0-9<]", "", line)

            if line:
                lines.append(line)

        return lines

    def _parse_name(self, value: str):
        parts = value.split("<<", 1)

        surname = parts[0].replace("<", " ").strip()

        given_names = ""
        if len(parts) > 1:
            given_names = parts[1].replace("<", " ").strip()

        return surname, given_names