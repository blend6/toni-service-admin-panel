export const fmtDate = (d) => new Date(d).toLocaleDateString('en-GB')
export const fmtTime = (d) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
export const fmtSize = (b) => (b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(2) + ' MB')
