#!/bin/bash
#tsplus.sh
#ts+ compiler
#

file=$1

compile() { 
  local f s s1 s2 s3 s4 s5 s6 s7 s8
  local out
  
  f="$1"
  s1='/#/s/\*/,Star,/g'
  s2='/#/s/\?/,QM,/g'
  s3='/#/s/$\$/,_dbldlr,/g'
  s4='/#/s/\$/,$,/g;/#/s/_dbldlr/$$/g'
  s5='/#/s/<\([a-z][a-z0-9]*\)>/\1(),/g'
  s6=/#/s/,,/,/g
  s7=/#/s/,#/#/g
  s8='s,#\(.*\)#,new REX([\1]),'
  s="$s1;$s2;$s3;$s4;$s5;$s6;$s7;$s8"


  out=$(sed 's,\.tsplus,.ts,' <<< "$f")
  rm -f "$out" 2> /dev/null
  sed "$s" "$f" > "$out" || exit 1 

  return 0
}
 
usage() {
  >&2 echo "Usage: $1 <file.tsplus>"

  return 0
}

sanitized() {
  f="$1"
  b=$(basename -s .tsplus $f)
  e=$(sed "s,$b\.,," <<< "$f")
  if [ "$e" = "tsplus" ]; then
    return 0;
  else 
    return 1;
  fi
}

if [ "$file" = "" ] || [ "$2" != "" ]; then
  usage
  exit 1
fi

if ! sanitized "$file"; then
  usage $0
  exit 1
fi

compile $file
exit 0