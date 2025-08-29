// Serverless function for Vercel: POST /bfhl (rewritten via vercel.json)

export default function handler(req, res) {
    // CORS (optional, but handy if you test from a browser client)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res
            .status(405)
            .json({ is_success: false, message: "Only POST method is allowed" });
    }

    try {
        const body = req.body || {};
        const data = Array.isArray(body.data) ? body.data : null;

        if (!data) {
            return res
                .status(400)
                .json({ is_success: false, message: 'Body must be {"data": [...]}.' });
        }

        // ======= Helper predicates =======
        const isNumericString = (s) =>
            typeof s === "string" && /^[+-]?\d+$/.test(s.trim());

        const isAlphaString = (s) =>
            typeof s === "string" && /^[A-Za-z]+$/.test(s.trim());

        // ======= Buckets =======
        const odd_numbers = [];
        const even_numbers = [];
        const alphabets = [];
        const special_characters = [];

        let sum = 0;

        // We’ll also collect alphabetical characters from ALL tokens for concat_string
        const allAlphaChars = [];

        for (const item of data) {
            const raw = String(item); // normalize everything to string
            const trimmed = raw.trim();

            // Collect any alphabetical characters for concat_string
            const letters = trimmed.match(/[A-Za-z]/g);
            if (letters) {
                allAlphaChars.push(...letters);
            }

            if (isNumericString(trimmed)) {
                // numeric token → put in odd/even, add to sum; keep strings in output
                const n = parseInt(trimmed, 10);
                if (n % 2 === 0) {
                    even_numbers.push(trimmed);
                } else {
                    odd_numbers.push(trimmed);
                }
                sum += n;
            } else if (isAlphaString(trimmed)) {
                // pure alpha token → alphabets (uppercase)
                alphabets.push(trimmed.toUpperCase());
            } else {
                // everything else → special_characters (as-is)
                special_characters.push(raw);
            }
        }

        // ======= concat_string: reverse(all letters) then alternating caps (start UPPER) =======
        const reversed = allAlphaChars.reverse().join(""); // characters reversed
        const concat_string = reversed
            .split("")
            .map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
            .join("");

        // ======= Your identity (edit these three) =======
        const fullNameSnake = "hardik_sachdeva";               // lowercase with underscore
        const dob_ddmmyyyy = "22022005";                       // ddmmyyyy
        const email = "hardik.sachdeva2022@vitstudent.ac.in";                    // <-- put your real email
        const roll_number = "22BCE2850";                     // <-- put your real roll number

        const user_id = `${fullNameSnake}_${dob_ddmmyyyy}`;

        return res.status(200).json({
            is_success: true,
            user_id,
            email,
            roll_number,
            odd_numbers,
            even_numbers,
            alphabets,
            special_characters,
            sum: String(sum),     // sum as string
            concat_string
        });
    } catch (err) {
        return res.status(500).json({
            is_success: false,
            message: err?.message || "Internal Server Error",
        });
    }
}
