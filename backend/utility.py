#List of replacements for illegal SQL characters and what they are replacing
SUBSTITUTIONS = [('_', ' '), ('$', '/')]

#Replace convention characters with characters for human display
def display(in_string):
    for to_replace, replacement in SUBSTITUTIONS:
        in_string = in_string.replace(to_replace, replacement)
    return in_string

#Replace illegal characters with convention characters
def sanitize(in_string):
    for replacement, to_replace in SUBSTITUTIONS:
        in_string = in_string.replace(to_replace, replacement)
    return in_string
