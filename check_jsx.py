import sys

def check_tags(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()
    
    tags = ['Card', 'CardHeader', 'CardContent', 'Tabs', 'TabsContent', 'div', 'Button', 'Badge']
    stack = []
    
    import re
    # Match <Tag or </Tag (ignoring attributes)
    tag_re = re.compile(r'<(/?)(Card|CardHeader|CardContent|Tabs|TabsContent|div|Button|Badge)(?:\s|>)')
    
    for i, line in enumerate(lines):
        line_num = i + 1
        matches = tag_re.finditer(line)
        for match in matches:
            is_closing = match.group(1) == '/'
            tag_name = match.group(2)
            
            # Simplified: ignore self-closing tags like <Badge />
            # Actually, check if it ends with />
            if not is_closing:
                # Find start and end of this tag opening
                match_start = match.start()
                tag_end_pos = line.find('>', match_start)
                if tag_end_pos != -1 and line[tag_end_pos-1] == '/':
                    continue # Self-closing
            
            if is_closing:
                if not stack:
                    print(f"Error: Found closing </{tag_name}> at line {line_num} with empty stack")
                else:
                    last_tag, last_line = stack.pop()
                    if last_tag != tag_name:
                        print(f"Error: Mismatch! </{tag_name}> at line {line_num} closed <{last_tag}> from line {last_line}")
            else:
                stack.append((tag_name, line_num))
    
    for tag_name, line_num in reversed(stack):
        print(f"Error: Unclosed <{tag_name}> from line {line_num}")

if __name__ == "__main__":
    check_tags(sys.argv[1])
