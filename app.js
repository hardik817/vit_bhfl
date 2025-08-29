const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());


const USER_DETAILS = {
    full_name: "Hardik Sachdeva",
    dob: "22022005",
    email: "hardik.sachdeva2022@vitstudent.ac.in",
    roll_number: "22BCE2850"
};

const isNumber = (str) => {
    return !isNaN(str) && !isNaN(parseFloat(str));
};

const isAlphabet = (str) => {
    return /^[a-zA-Z]+$/.test(str);
};

const isSpecialChar = (str) => {
    return !isNumber(str) && !isAlphabet(str);
};

const alternatingCaps = (str) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        if (i % 2 === 0) {
            result += str[i].toLowerCase();
        } else {
            result += str[i].toUpperCase();
        }
    }
    return result;
};

app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input. 'data' must be an array."
            });
        }

        const oddNumbers = [];
        const evenNumbers = [];
        const alphabets = [];
        const specialCharacters = [];
        let sum = 0;
        let allAlphabets = '';

        data.forEach(item => {
            const itemStr = String(item);

            if (isNumber(itemStr)) {
                const num = parseInt(itemStr);
                sum += num;

                if (num % 2 === 0) {
                    evenNumbers.push(itemStr);
                } else {
                    oddNumbers.push(itemStr);
                }
            }
            else if (isAlphabet(itemStr)) {
                alphabets.push(itemStr.toUpperCase());
                allAlphabets += itemStr;
            }
            else if (isSpecialChar(itemStr)) {
                specialCharacters.push(itemStr);
            }

            else {

                let hasAlphabets = false;
                let extractedAlphabets = '';

                for (let char of itemStr) {
                    if (isAlphabet(char)) {
                        hasAlphabets = true;
                        extractedAlphabets += char;
                    }
                }

                if (hasAlphabets) {
                    alphabets.push(itemStr.toUpperCase());
                    allAlphabets += extractedAlphabets;
                }
            }
        });


        const reversedAlphabets = allAlphabets.split('').reverse().join('');
        const concatString = alternatingCaps(reversedAlphabets);


        const response = {
            is_success: true,
            user_id: `${USER_DETAILS.full_name}_${USER_DETAILS.dob}`,
            email: USER_DETAILS.email,
            roll_number: USER_DETAILS.roll_number,
            odd_numbers: oddNumbers,
            even_numbers: evenNumbers,
            alphabets: alphabets,
            special_characters: specialCharacters,
            sum: String(sum),
            concat_string: concatString
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

app.get('/', (req, res) => {
    res.json({
        message: "BFHL API is running",
        endpoints: {
            POST: "/bfhl",
            GET: "/bfhl"
        }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        is_success: false,
        error: "Something went wrong!"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;