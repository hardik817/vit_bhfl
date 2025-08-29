const https = require('https');

// CHANGE THIS TO YOUR VERCEL URL (without https://)
const VERCEL_URL = 'vit-bhfl.vercel.app';

// Tests
const tst = [
    {
        name: "Example A",
        data: { data: ["a", "1", "334", "4", "R", "$"] },
        exp: {
            odd_numbers: ["1"],
            even_numbers: ["334", "4"],
            alphabets: ["A", "R"],
            special_characters: ["$"],
            sum: "339",
            concat_string: "rA"
        }
    },
    {
        name: "Example B",
        data: { data: ["2", "a", "y", "4", "&", "-", "*", "5", "92", "b"] },
        exp: {
            odd_numbers: ["5"],
            even_numbers: ["2", "4", "92"],
            alphabets: ["A", "Y", "B"],
            special_characters: ["&", "-", "*"],
            sum: "103",
            concat_string: "bYa"
        }
    },
    {
        name: "Example C",
        data: { data: ["A", "ABcD", "DOE"] },
        exp: {
            odd_numbers: [],
            even_numbers: [],
            alphabets: ["A", "ABCD", "DOE"],
            special_characters: [],
            sum: "0",
            concat_string: "eOdDcBaA"
        }
    }
];

function run(tc) {
    return new Promise((res, rej) => {
        const pd = JSON.stringify(tc.data);

        const opt = {
            hostname: VERCEL_URL,
            port: 443,
            path: '/bfhl',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(pd)
            }
        };

        const req = https.request(opt, (r) => {
            let d = '';

            r.on('data', (ch) => { d += ch; });
            r.on('end', () => {
                try {
                    const rsp = JSON.parse(d);
                    console.log(`\nTest: ${tc.name}`);
                    console.log('Request:', JSON.stringify(tc.data, null, 2));
                    console.log('Response:', JSON.stringify(rsp, null, 2));

                    // Validation
                    let ok = true;
                    const err = [];

                    if (!rsp.is_success) {
                        err.push('is_success should be true');
                        ok = false;
                    }

                    ['odd_numbers', 'even_numbers', 'alphabets', 'special_characters'].forEach(f => {
                        if (JSON.stringify(rsp[f]) !== JSON.stringify(tc.exp[f])) {
                            err.push(`${f} mismatch. Expected: ${JSON.stringify(tc.exp[f])}, Got: ${JSON.stringify(rsp[f])}`);
                            ok = false;
                        }
                    });

                    if (rsp.sum !== tc.exp.sum) {
                        err.push(`sum mismatch. Expected: ${tc.exp.sum}, Got: ${rsp.sum}`);
                        ok = false;
                    }

                    if (ok) {
                        console.log('Test PASSED');
                    } else {
                        console.log('Test FAILED');
                        err.forEach(e => console.log(`   - ${e}`));
                    }

                    res(ok);
                } catch (e) {
                    console.error('Parse error:', e);
                    rej(e);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Error: ${e.message}`);
            rej(e);
        });

        req.write(pd);
        req.end();
    });
}

async function runAll() {
    console.log(`Testing Vercel API at: https://${VERCEL_URL}/bfhl`);
    console.log('Starting tests...\n');

    let all = true;
    for (const tc of tst) {
        try {
            const ok = await run(tc);
            if (!ok) all = false;
        } catch (e) {
            console.error(`Test ${tc.name} error:`, e);
            all = false;
        }
    }

    console.log('\n' + '='.repeat(50));
    if (all) {
        console.log('All tests PASSED!');
    } else {
        console.log('Some tests FAILED.');
    }
}

// Run
runAll().catch(console.error);
