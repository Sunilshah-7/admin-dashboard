import React from "react";
import "./WidgetSmall.css";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function WidgetSmall() {
  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members </span>
      <ul className="widgetSmList">
        <li className="widgetSmListItem">
          <img
            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBYWFRgVFhYYGRgaHR4cGBoaHBoaGh4aGhwcHB8kGBgcIS4lHB4rHx8aJjgmKy8xNTU1GiU7QDs0Py40NTEBDAwMEA8QHxISHz0sJSs0NDQ0NjQ0NDQ0PTQ0NDY0NjU0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NP/AABEIAO4A1AMBIgACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAAAgMEBgUHCAH/xABAEAACAQIDBQUGAgoBBAMBAAABAgADEQQSIQUxQVFhBgcicYETkaGxwfAy4SNCUmJygpKi0fEUQ2OywiQlgxX/xAAZAQADAQEBAAAAAAAAAAAAAAAAAgMBBAX/xAAkEQACAgIDAAIBBQAAAAAAAAAAAQIRITEDEkEiUQQTMmGRof/aAAwDAQACEQMRAD8A3NCEIAEIQgAQhCABCEIAEIQgASFiMcqAlg1lNibX1tfQDX1tJswvaNL0m8WQZWLNe3htrrY9PluMx6A152s7SVMUwphHp0VYG91u+tvEAdNOHxlewDqcQKQqKMy3QhrG4F7OtrgEajfoNeE9sztlNTwAAgLpvt+tw3j6Su9oRTp1/apXBdWBCKLgZbAAMG5CxkFUnkS2ZHtZgFZTVpt46bZaqjRlzGwYW0KnfcW336Bew9oAUxh6Sl2fR2I8IXkAN5O/y3mVGrtZ2ZmJvmBU8LrckA87XmX7K0q71hkORRYs7GwAsLAniLD8I38Y7VLIdX4ZPb+EKeFVJdtWPC/Rd2nAmw+cwVJw6+xcgsLlXv8AhO+wPHjf8pcttAVSyhiQv4nVTdjutpuAA5/WUXHFVqBKY/CfER+1xsBpoNLxIZB4wiMFKnK29TqPK+n3zisJXYHTNa/DieV55jFOYnW9hqfTW8fwmRdaiBhvub8bcAwv75RmYZfey/b16IIJNhYG4up6Bd5PUTb3Z3tFRxiZ6dwR+JG0YenEdZzdUenUZcq+yLaKwJZDzBDaqfKWDsfXr08UlOhVFNicpuucm/Bh6XIFraTFJp0NlI6LhGcPfKuYgmwuQLAny4R6VGCEIQAIQhAAhCEACEIQAIQhAAhCEACEIQA8mue321UZzQurC1iGbwAg3ItuzX4nlYazY00h3j496mIeiqIioxKMm9mJF/am17mxA4axJ5QsnRX0UUqrZi3iUqbkWZWvbdoGFxqOkq21MMFYlbZb6Wv93ic75rZmFju1+NriSamZWDBb8cpF1PUDnvk1cXdi2N4XBUyl2ch7iy9DzmRbG2uLPlUWyoQoJGmpPDoB8piK6OzXtrvOhElbO2g1O4sDzzDmNR13cYSV52Vimycu3K9UexoplHHKPFbmW0A+Hvkitsb2NH2r2BPJgzX3aldBysCZX6uOe+8gE3I4cxfnpaSMXtWpWVaRNlBFl3C/M9BfQcI9PXgjimRazFrk2BOgUfAe60yqMHWmjfqkZ9LAW0t10tr5xa9nHIBUqdBY3sCP2v3V6nU2NhujSYMk+Eiwv4joAL6s3zHQdRMbvCEZNw2z1zgLquewPmCSQPQRrbNJqOJRkLB8qNcGxDm6kg87rf1mb2IUAyj9VksTvtqzFv3rAeRqWlex2LbEYpmBta4HKwY9d2vWT1Jv+ClfE6A7C7dbFYVKjkl9Ue9gwqLvBA4EWYG246y0TVPdvtU086GnUIJDeFL7ha44kgfCbOwuKWooZTcHmCCDyYHUHoZaEuys2qJMIQjgEIQgAQhCABCEIAEIQgAQhCABCEIAJnP/AHhq1LFVVckZ2ZxmAcWY38JOtunCdAykdptgpjKz06gC5QpSoou6mxve5sU3DL5xJypB+l+p7rJoPE4gOMxAzA2uLENb621j+wsRmcIQCp1NyABaSe0uwKuEqtTcK1jvUnKynUG3K1tJD7PU/wD5Cg66jWwJ4brybro6FjH5UzaHZ3s0tclmTw7hqdR0lf7XdkvYsSqErY2PXr1m2dhWCCwI0Gp3zI1sOjizqp89ZypYuLydiaWGsHJ9ZCGIN79d8QjkG4M352l7tKNa7U/A9t28emtxNXbe7BYrDAsyhkH6yzrjyqqlgk+O/wBuTC4fabWys5y8bbyOItxJ5n1kvFbXzACyqi6rTU72G5qjD8RvbTd9cVXwToLspAPMRFFrHQXPDp5dY+Nok4NOmjKDHsqFQbs4ObcLZjmbXmdPcIns9hlZySrG34bEDXrMdiAb6rlvuH+9TMlsbbDYa5REdjxdcyj04xZR+Lr01pp0zYWxMJUYMaVZKZUrZmqBQGvu1uCbcNd02h2WxFR0b2iMCpy57EI9v1kzDNa1ummk1x3U7Uq18Wc1IMoQlqmUADgMvAC4tYH03zc0Xi43BGylZ7CEJcUIQhAAhCEACEIQAIQhAAhCEACEIQA8mE2xifZksFLMbKoG8kzNyHjKNyD93BvJcqbjgpxNKWTVvbvYpqouJqL7KogsUzBgQC+S7Djq1x6TD923Y5qpbFVmKqGIUC12I3k3GgE2R2vwoq4coQczNYHrY7un5yfsbZ60KCUl3KvxOp+M5k3mPhVtXdZHKGHCDKosB0kkZuQPnofrKX2hzhy//LSnwSmWFMHzZjr7ucxNLt3UwxVK6Fqf7YOdT/C63HoZkN0bJOrNmCoOGh5E/wCJGxLqwyuNOouP8TDbM7UYPFj9E6sw3ofC68PP1EyCo1rqxA4B/EPfv+c2d6MjFbMNtrZ2GqIUdBbmFHXiJratsOjTc5LMOF9/+5tbF4Oq369NfJGY/wDkJgtqbHqFbs6FRvzUwv8AdmJnLOPJ5g64Sillmnu1FIJUUWtpf4y7djO7cYqn7dqjIhfKFG9lU2bh7mvwOkg4js1Ux20vYU1Ip0sq1H/VXTM2vE3NrdJvnZ+DSjTSkgsqgAf5PUnWelxRagk/o87lalNsVs/BJQprSpqFRAFUDgBJUISwgQhCABCEIAEIQgAQhCABCEIAEIQgAQhCAHkbrJcdeEchMavAGA2jhSxUgMCrqxudCNxt6E+6ZBo5it48vrGHackoqLdFk2zCbb7P4esQ9Sir6Eai9geQPH625TWqdgadNKmbEszFbUQilACDe9Sx8TcLdd+6blz8JBbZdNmzMik79wvMuSVRKR63cvDVGD7CYpVFbKoYEm6MLkDS5UaEHfp7pdMZt5sNQD1h4lUXF97bpc0AHhAAHKUPvLwIdE0BGbUeQ+MSfx+TZWE+760U/G96mIN1Skovotybm+4243mKoPjsdW9jUqMpHiZGBWw33t66SRhdjgsrKoDLuYBSR7wR8JsLsfs9PaAWLHUs7as195LHXpNjzwm1GKyJPhcbcn/RbeymyxhsNTp72yhnY72dhcljvJ4ekzUBPZ3JUqOMIQhNAIQhAAhCEACEIQAIQhAAhCEACEIQAIQhADyNV3yqTyEjV8SubIGANr2B11jGIpk8SfXhJS5VlIdR1Yylds9m1VhdW5EWup+Y9Y7muZBJZRlJub+A+X7R58IrD1s2u7pynL2su4eonHSMGsTunlSsBqxAHM6COq2mg0gshodpCU7vCqFaYe2imx/mIEk4rtAuDdxVqsyAZlBW7KDwLKNRyvr1MqHaztamIX2NLxB7Z34LqDYczpDkqUaLcPHJTT8J/ZzEoKLsQM2b1sQPreXfslgiENVhYv8Ah/h5+plA7H4D2lRaTMAGJJF7EqupAHE/5m30UAWAsBoBD8Tjxb80L+XNduqHIQhO84QhCEACEIQAIQhAAhCEACEJ4TAAheYbHdpcJRv7SvTBHAHMf6VuZgcZ3lYRPwLUc9FCj3uQfhNUWxHywjtl3hNVYvvYIvkoL0zOT7wAOPWV7H96WOfwoKdMHiqkt72JA903qxFzRejeVWoqi7MFA3kkAe8zEY7blBWCuxQXADOrIjE3sFdgFY6c5oPB7fdsXRrYqo9RFqKzh2LAKDvynQW32A4TfdDE0cTTOVkqowsw0cG43MP8yPK+uC/FUsicfs6lWALqCRqrg5XHHwuNR74YFHp3V6mdf1Sy2cfxMDZuGthGNm7MGHOWm7Clwptdgh/7bk3Vf3TccrDSSMebU2I38JyNLZ0q3jwVtAAo1hc20le2XtAhlVzbPbKTxa3z0P2Zl8C5yWbWYfH4UNTZDpYkoRvU3upB4EHX0kpu6ZaMVTizL4mijAh1VhyYBh6g6SrY/Yri7YTE1KLA39mWY0yOSqT4fTSZXsztxcRTKuQK1I5Kq7vENzAfssNR7uEd2vsPPdkxD0m/dCsD5q0pH4v7RvHPq6ZU8VtzG0qbLWwK1iVymoDoRa12QAnjKDSq65hTCC/i8WgG/TS8tW3sNtCmMrV1qUzpnXwm3Nhw+Mo226pS1EHgGY/xWIHusfUSlRm6RTlnGEbW3/QjaO3HastSm7J7M/o2UlWB4tpuJ+Wktuxu97G0rCsErqOLDI/9a6e9TNcQnWkkqR5cm5O2dIdm+9HBYkhXY0Kh0C1Pwk9Kg8PvtLyjggEEEHUEagjoZxtLBsHthjcHYUK7BB+o3iT+ltB6WmmHVkJonAd9eJAtVw9J+qFqZ9b5h8patj98eDqHLWSpQP7RGdfeuo90ANmQkTZ+PpV0FSi6Oh3MhDD4ceklwAIQhADyNVagVSzEAAEkncABckx2VfvFxhp4CtY2LZUH87AH+281K2LJ0mylbc7zKzMy0AqLrlYrmYi+h10HlYym4/b2IrH9JVdujNp/Tu+ExDvY26fIzwEc/wDW6XVLSPPl2ltkhqp5290js/5Txj1jLPbdfd99IOQsYinaMndPS1vznje6KVSouPdbVoDHD2qgsUYUSwBAfS/kxXMAfPnNpbW2DmcV8M/sMQNCwAKOo/Vqp+sOo1F5zyWtre1rG4Oosd46zbHd124NZP8AjYlv0qj9G5OrqODfvAe8eRnLzR9O/wDHnSo2Tnstza9tZj0zEG50J9LTzEYtSoHzkik4tacTleDsS6oavykDaFM2MyLjW8jVxcESU9UPB5s0320NTDYha9F2RmGrKfnw9DMtsXau08UAxKqnBylrjmF43lh21sdHdHdcyo2ZhbNcDU6cectuz8EmVWSzKQCpGoIIuCOlp1fjVyQqS0R/KlKE7j6Uqpsb2SPisXUestNS4p5QiEqLgEXJIvYWJsb6zTeOxTVaj1HN2dizeZN9Jt/vl2z7OimEQ+Kr4355FOg8i3/hNLzrjCMdI5u0pZk7CEITQCEJ6BABSUyTYSSuBJtqJIpAKNB6xQfU6+Hj9BpHUV6QlyN6JGx8ZXwre2oVmpsOKkWPRlN1YdCDN392nbo48PSrALiKYzHLoHS9swXgQSAR1HkOfsViL6DdLb3QYoptSiP21dT5FC3/AKiLKvB4XtnScIQmFDyas76NpELQw43EtUf+XwqPi/uE2nOce8fbf/Ix1WxuqN7Nbck0PvbMfWNHZPl/bSK9XYXHI3BP35TzNGahuvXeOZtE06l9ef37495OfpgksRrYmNudPvdPKL7xEO2otNZijmhxj6xvMRpr05iek/PjziV5/fGYzUhJN9/w+9ZO7OYVqmMw1NSQWqoLgm4GYXIP8IMiEeY/1LN3Z0c21KB4IWY/0lR8WESRSDybhq7L9lUsxurE5G+OVv3gOPEDzkxUtM1iaCupVhofeDwIPAiV3GFsOf0gunCoBpb9/wDZPwnDycPV2tHoQ5bwyXee1KXERrB4pHtlN/IzKUsOW6CSjHvhDuXXZh6WGYnLa54TGVaybJw7HEVc1M1CKCAXdVc5igubMqnMRyXTXSWTbe1aOCoNXqmyjl+JmO4AcSZzj2r7RVsdXNaroBcU0H4UTeFHM8zxPS1uvh4umTn5uXvgR222x/y8bVqqSUvlp30/RqMq2B3X1b+YyvESYw1vxE9ZAR9f8c50UQUyDHKdMn/Mk/8AHHXoIsp4fmOghQPk+iG6W4/fCOUKR3+6JXxGTUG4QirZk5NKhLkmwB8zyAjGIrcBuGnn5xw1LAkbyfl9mRFFzCTCK9fh7TQsZdu6XDe02pSI3IHf0Clf/aU6nrpuFtT06S/9x6E7RYjcKLk/1IPrFHWWdCQhCAxjdvbQGHw1asf+mjMBzIGg9TactOMxLE+Im5PMnUmdB962IybOqfvMi+9gT8AZzyzWOhPz3R4keRu6PF0Ovof9RmkeHEH/ADHDUMaJ8Xn84MxLYtahDfCOM3iAjRHiHmI4yjMJpjS/wW3uMBbh9iAXrHF3cZoliR85ae67Cl9ooBuUXa3IHN8wJVgT5bpsnuMw2atXq2/CuUHqSv0vEkPBWzdcS6Aggi4O8RUIpcwOz9grSrO62CHcg5/RenWZqrUVFLMQFUEsToAoFyT0AlH2x3k4ahjlwhsU1WtVv4Uc/hHWx/EeF+htr/vJ7x2xWbDYViuH3O+oar05hOnHjyiqMVpDNt7MR267Uvj8QWuRRQlaKfu/tEcWbf0Fh51jL9/lGqT3Hz/KOA8Pn+coiErvIlhynrVCLa6H4eXSFp6y+f8AuaAtVvrGa9TTz+A4QWpbwndf4cogi7a7pjdgo08juHSwvzvF1KlhYXudBFCoFG/76yIxJOnD4TXhGJOTtisQw3cBGQCfKOlAN1j1O70gEvqbnyBtMeyipIb4WG7j+c3p3HbDVMM+LOrVmKL+6lMkH1LXPoJogmdL90lDLsvD82zsfWo9vhaKMkXSEIQNNcd9da2Cpr+3WHuVHPztNHKvLr5zcPfPjkZaWGFs6n2jG+4EMoHrqfQc5p6oACbG95RLBzTacmkeG1reWsiVm/zFVXuecZynnMbKQjWWP0zu8xHq/wCIcpGw51HO8kkEndugtCyVMctvgD9R7+U9B++MGjEjwNvM3N3HYXLhalTi7n3LpNL1GGU/nOg+6ihl2bRP7Vz8f9xHstxoucrvbrFYinga74VS1ULpbVlUkBmUcSFuR111tLFCKVOOWa/UniYiWbt+tP8A/oYn2KqqByLLuzDRjbhdr6CVmAzTWxSMQbiTqS31G768Zj4/QrFT0O+MmTmrWCXbn9/lEMDbmOv3v/xFsOI+h91oi/HT7+UZkkM1EJ/zEIfs8Y8Gtu3RNZBvHqItFE/GNtpfrH1oaAcd+u7UcoympHKTbak/d4JWZKTWCHVQry9wjWc/6kmsZGMGNF2siJ0T3LbTars8I3/RdkB5qbOL+WYj0E54zHnOoO7rZdPD4CgKZv7RRUdjvZ3AJPkNAOgijFqhCEDTm3vK2qtfHVmQ3VSEBG45FCkj+YNKbYkyfUoC+vvnjAKLkyjic0Zrz0h/8Y7zGqlt0XVxJOg0E9o0QdT7otXhFU2lchGGPiEyLDl9+vvmPLDNcaASeraDlNj9E+XaYpfOeNqekUp03CB9IxJPJHxO4/lOo+y+CFHCYen+zTW/mVBPxM5mwWH9rWo0zueoiHyZgD8J1aBbQRHs6OPR7I+OxIp03qHcisx/lBMfAlV7zcd7LZtcje4WmP8A9GCt/bmiloq2kc7Y4M5Z2/EzFjzubk/EzFkTPOtx8vTT7+kxWMpkG/CM1WTt/J4aXZEWEXl0uPWIinCScO/D3Ryp/r746yGDJdFwRc8Iyd4JyVZPUp3ia3h847TcsdLADj97pGxLXY28hNehYpuWRNFrHzmQFx9/OQvZDLfiDrHcO99Dv+kFgJq8oVWufgJFcSdUA38vj+chuJkkEGMmdO91uIz7Lwxveysv9DsoHuAnMRnRvcu99loOT1B/df6xSpfoQhA05LxOLFrTFuxJ+kkmlc3PnHVogbpR3I549YLA1QoW1MViqmUZQdeM9r1co6yC7Em5mNpKkNFOTtngMm0m3esgx2k0xMeatGQEAdI2rX5xwRznaoyvZRc2Owy7/wBIG/pBb6Tp1DcA85zT2Kou20MOqLmbxEDQfqEEkncAPlOkqIKqoOpAtpJvZfj0PE2mpe/LapWnhqAv43Z28kAA+Ln+mbWKX1M0H31Y3Pj1pDdSpqP5nJc39Csx6KxvsqKyoGUDjYHpu+P+pExtsp9I9R1G8X6/Qj738pB2jcAC+h1+/fKN/E9XlnXGyLSS99+gjbLaTcLTsLnj8t0YxDXNgP8AcVrB4ylcmhjLHAlgT0+c8VrcPOKY6WmUa2yThjlUnzP0EYope5MXVPhtflF0l0Fo1eE7pN/Z4q+Fvh9mIUgEcL6X6GOruItvEjtuHpMZsc2TM97X1+9IxUGhMSj2nrG4uPWa3YqVMimdH9zKW2XTP7T1D/eR9JzgROm+6rDFNl4YHeQzej1GYfAiIWLhCEIGnJFOlxjNavbd743XxJO7dI+pjt/RCMHuR4xudYmKItExCyCO0TGpmq+w6lPC0sUwIWq7qilW1CKpDBrZbElhY2PgJFxe2oGsEane1o6vXlGUP3zkj/HCURyy2WrurP8A9lTbkpHvUidCqs5m7CY40sarjgbgeXD5zpLCYoVEVl3MLiSvLLxxgkNOWO2mN9ttDFVDuNVlH8KHIv8AaonT+OxIp03c6BFZj/KpP0nIlesXZmO9iWPmTcwZWLp2SqdQiR6pJa3HQRAqGO4Vbm/LWareCnLy3Ek1XCiw8h6aayJTTS54xVdszWi2sIzyzkiqX8sSyZhcbxv8o2nCFKqQbj1EXUtvG75enCYPnR7Va4GvGPKbb/dIbGSQ4Nj9/lNTyLJYPQRrfdGTuP39744hNzb7uIlrDzmMENcOkXTHDmOus9ZTYDiTPW0cAcLD/P1mDbGSN/T5TrPszh/Z4TDp+zSQf2icnNYHnvH0+U6w7L1y+Dwzt+JqSE+eUTBkZaEIQNOP6Q6fe6eV7CO1q2XS15BZrx26wSim3Z4Z5HRTjRiFEy1d3/Zg47EhGH6JLPU36i9ggI1BY3F+ADHhNv8Aef2ZFTZpWkFT/jn2qrfKoRFKlV4CyWtu/D1knuo2IlDAU6gVc9ZRUdgPEb5ioJtuCEC3AltTeTO9LElNl4pl3lVX0qVEQ/BjA05spVNLdOEkq9xv98xoMfoVNYyZKUPSfsKrkrqx0F9DwnRvYzFB6OW/4Tf0P53nMmCrWYXFxf5zfPdVVLCoOAVQL+cRbNqmWDvExGTZ2KPOmy/1DL9Zy5Omu81L4CuP+2x/psZzOomseKsFW5sJOICDTXr1kfCLdhDFVCTblGWFYksyo8orx90HP+4t9BblGwPlB4BZyNGEDPIpQW3xilbS0UouLcRxjU0XeCRTbjPKo0G6MhrRwnhym2LVOySFBZRyF4yBmYm2+5EdBtmPSw919Ymlpc8hp74MxYQrBYJ69VKKC71HCr5sba9OM61wmHFNEpr+FFCjyUACaE7kdnpUxzVG1NGmWX+JiEv6At750HFKJUEIQgaf/9k="
            alt=""
            className="widgetSmImage"
          />
          <div className="widgetSmUser">
            <span className="widgetSmUserName">Andrew Garfield</span>
            <span className="widgetSmUserTitle">Software Engineer</span>
          </div>
          <button className="widgetSmButton">
            <VisibilityIcon className="widgetSmIcon" />
            Display
          </button>
        </li>
        <li className="widgetSmListItem">
          <img
            src="data:image/jpeg;base64,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"
            alt=""
            className="widgetSmImage"
          />
          <div className="widgetSmUser">
            <span className="widgetSmUserName">Andrew Garfield</span>
            <span className="widgetSmUserTitle">Software Engineer</span>
          </div>
          <button className="widgetSmButton">
            <VisibilityIcon className="widgetSmIcon" />
            Display
          </button>
        </li>
        <li className="widgetSmListItem">
          <img
            src="data:image/jpeg;base64,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"
            alt=""
            className="widgetSmImage"
          />
          <div className="widgetSmUser">
            <span className="widgetSmUserName">Andrew Garfield</span>
            <span className="widgetSmUserTitle">Software Engineer</span>
          </div>
          <button className="widgetSmButton">
            <VisibilityIcon className="widgetSmIcon" />
            Display
          </button>
        </li>
      </ul>
    </div>
  );
}
