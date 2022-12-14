#List of replacements for illegal SQL characters and what they are replacing
SUBSTITUTIONS = [('_', ' '), ('$', '/')]

#Replace convention characters with 
def replace_chars(in_string):
    for to_replace, replacement in SUBSTITUTIONS:
        in_string = in_string.replace(to_replace, replacement)
    return in_string
