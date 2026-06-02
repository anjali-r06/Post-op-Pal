import qrcode

TWILIO_NUMBER = "+14155238886" # Your bot's number

# 1. Tell Python to STOP and ask you to type the ID!
patient_id = input("Enter the new Patient's ID (e.g., 1024): ")

# 2. It takes whatever you typed and puts it into the link
secret_link = f"https://wa.me/{TWILIO_NUMBER}?text=POSTOPPAL_PATIENT_{patient_id}"

# 3. Generate the unique QR code
img = qrcode.make(secret_link)

# 4. Save it with their specific ID as the file name so you don't lose it!
filename = f"qr_code_for_{patient_id}.png"
img.save(filename)

print(f"✅ Created {filename}! You can print this now.")