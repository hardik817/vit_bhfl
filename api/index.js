const express = require('express');
const cors = require('cors');
const app = express();

// Mid
app.use(cors());
app.use(express.json());

// usr
const USR = {
    full_name: "kaustubh", 
    dob: "17091999", 
    email: "kaustubh@xyz.com", 
    roll_number: "ABCD123" 
};

// num
const isNum = (s) => {
    return !isNaN(s) && !isNaN(parseFloat(s));
};

// alp
const isAlp = (s) => {
    return /^[a-zA-Z]+$/.test(s);
};

// spc
const isSpc = (s) => {
    return !isNum(s) && !isAlp(s);
};

// alt
const altCap = (s) => {
    let r = '';
    for (let i = 0; i < s.length; i++) {
        if (i % 2 === 0) {
            r += s[i].toLowerCase();
        } else {
            r += s[i].toUpperCase();
        }
    }
    return r;
};

// post
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        
        // val
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input. 'data' must be an array."
            });
        }

        // init
        const odd = [];
        const evn = [];
        const alp = [];
        const spc = [];
        let sum = 0;
        let allA = '';

        // proc
        data.forEach(itm => {
            const s = String(itm);
            
            // chk
            if (isNum(s)) {
                const n = parseInt(s);
                sum += n;
                
                if (n % 2 === 0) {
                    evn.push(s);
                } else {
                    odd.push(s);
                }
            } 
            // alph
            else if (isAlp(s)) {
                alp.push(s.toUpperCase());
                allA += s;
            }
            // spec
            else if (isSpc(s)) {
                spc.push(s);
            }
            // mix
            else {
                let hasA = false;
                let extA = '';
                
                for (let c of s) {
                    if (isAlp(c)) {
                        hasA = true;
                        extA += c;
                    }
                }
                
                if (hasA) {
                    alp.push(s.toUpperCase());
                    allA += extA;
                }
            }
        });

        // rev
        const rev = allA.split('').reverse().join('');
        const con = altCap(rev);

        // resp
        const rsp = {
            is_success: true,
            user_id: `${USR.full_name}_${USR.dob}`,
            email: USR.email,
            roll_number: USR.roll_number,
            odd_numbers: odd,
            even_numbers: evn,
            alphabets: alp,
            special_characters: spc,
            sum: String(sum),
            concat_string: con
        };

        res.status(200).json(rsp);
        
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

// get
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

// root
app.get('/', (req, res) => {
    res.json({
        message: "BFHL API is running",
        endpoints: {
            POST: "/bfhl",
            GET: "/bfhl"
        }
    });
});

// err
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        is_success: false,
        error: "Something went wrong!"
    });
});

// exp
module.exports = app;