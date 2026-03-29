const nodemailer = require("nodemailer");
async function test() {
  const user = "mozammalhaq01@gmail.com";
  const pass = "iyxvdnjjtmzdyeyb";
  console.log("Starting SMTP Test...");
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  try {
    await transport.verify();
    console.log("SUCCESS: SMTP transport verified.");
    await transport.sendMail({
      from: user,
      to: user,
      subject: "TasteNest SMTP Check",
      text: "Automatic SMTP verification successful.",
    });
    console.log("SUCCESS: Test email sent.");
  } catch (err) {
    console.error("FAILURE:", err.message);
  }
}
test();
