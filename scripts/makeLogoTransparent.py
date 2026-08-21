from PIL import Image

def process_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        # Check if the pixel is white or near white (R, G, B > 230)
        if item[0] > 220 and item[1] > 220 and item[2] > 220:
            # Make it fully transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Successfully processed logo and made white background transparent! Saved to {output_path}")

if __name__ == "__main__":
    src = r"C:\Users\hicha\Documents\GitHub\codefortomorrow-ai-version\public\assets\images\logo.png"
    process_logo(src, src)
