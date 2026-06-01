from __future__ import annotations

from pathlib import Path
from glob import glob
from typing import Optional, List

import pandas as pd
import numpy as np

import json


CAMINHO_CSV = r"C:\Users\Pedro\Desktop\teste drive\raw\df_4.csv"
CAMINHO_SAIDA = r"C:\Users\Pedro\Desktop\teste drive\metricas_por_dia_semana.csv"
CAMINHO_JSON = r"C:\Users\Pedro\Desktop\teste drive\dashboard.json"


ULTIMAS_LEITURAS = 5000


def limpar_endereco_mac(mac: str) -> str:
    """
    Limpa e padroniza o endereço MAC Address.
    """

    if pd.isna(mac): 
        # Verifica se o valor do endereço mac está vazio
        return None
    


    return str(mac).strip().lower() # Remove espaços vazios e transforma em minúsculo

def converter_bytes_para_mb(valor: Optional[float]) -> Optional[float]:
    """
    Converte bytes para MB.
    """

    if valor is None or pd.isna(valor): 
        # Se valor for nulo, retorna None
        return None
    

    return round(float(valor) / 1024 / 1024, 2) # Converte bytes para MB












def classificar_criticidade(score: float) -> str:
    """
    Classifica a criticidade da máquina.
    """

    if score >= 85: 
        # Score muito alto
        return "CRITICO" 

    
    if score >= 70:
        # Score alto
        return "ALTO" 

    
    if score >= 50:
        # Score moderado
        return "MODERADO" 

    
    return "BAIXO" # Score baixo













def nome_dia_semana(numero_dia: int) -> str:
    """
    Traduz o número do dia para texto.
    """

    # Dicionário usado para a conversão de dias da semana
    dias = {
        0: "Segunda",
        1: "Terça",
        2: "Quarta",
        3: "Quinta",
        4: "Sexta",
        5: "Sábado",
        6: "Domingo"
    }

    return dias.get(numero_dia, "Desconhecido")

















def carregar_csvs(caminho_padrao: str) -> pd.DataFrame:
    """
    Lê múltiplos CSVs e junta tudo em um DataFrame.
    """

    # Procura arquivos CSV usando a função glob
    arquivos = glob(caminho_padrao)

    
    if not arquivos: 
        # Se não encontrar arquivos, retorna um erro mostrandoo caminho
        raise FileNotFoundError(
            f"Nenhum CSV encontrado em: {caminho_padrao}"
        )

    tabelas = []

    
    for arquivo in arquivos:
        # Percorre cada arquivo encontrado

        print(f"Lendo: {arquivo}")

        
        total_linhas = sum(
            # Conta quantas linhas o CSV possui

            1 for _ in open(arquivo, encoding="utf-8")
        )

       
        tabela = pd.read_csv(
            # Lê apenas as últimas leituras do arquivo

            arquivo,
            low_memory=False,

            
            skiprows=range(
                # Ignora as linhas antigas
                1,
                max(1, total_linhas - ULTIMAS_LEITURAS)
            )
        )

        # Guarda o nome do arquivo de origem
        tabela["arquivo_origem"] = arquivo


        tabelas.append(tabela)


    # Junta todos os DataFrames em um só
    return pd.concat(tabelas, ignore_index=True)












def tratar_dados(df: pd.DataFrame) -> pd.DataFrame:
    """
    Realiza o tratamento dos dados, como limpeza e conversão de tipos.

    Limpeza do endereço MAC
    Conversão da data para formato datetime
    Conversão de colunas numéricas para o tipo numérico
    Tratamento de valores faltantes
    Outras limpezas necessárias
    """

        
    df["endereco_mac"] = df["endereco_mac"].apply(
        # Limpa os endereco MAC

        limpar_endereco_mac
    )

    
    df["data_hora_iso"] = pd.to_datetime(
        # Converte texto para datetime
        
        df["data_hora_iso"],
        errors="coerce"
    )


    colunas_numericas = [
        # Colunas que devem ser convertidas para numéricas

        "percentual_uso_cpu",
        "percentual_uso_ram",
        "percentual_uso_disco",
        "memoria_total_bytes",
        "memoria_disponivel_bytes"
    ]


    for coluna in colunas_numericas:
        # Realizar a conversão para numérico, ignorando erros

        if coluna in df.columns:

            df[coluna] = pd.to_numeric(
                df[coluna],
                errors="coerce"
            )


    return df














def enriquecer_dados(df: pd.DataFrame) -> pd.DataFrame:
    """
    Enriquece os dados com os dias da semana, memória em MB score e criticidade.

    Aqui também cria as métricas utilizadas para a análise
    
    """    

    
    df["dia_semana_numero"] = (
        # Extrai o número do dia da semana
        # Segunda = 0; Terça = 1; Quarta = 2; Quinta= 3; Sexta = 4; Sábado = 5; Domingo = 6

        df["data_hora_iso"].dt.dayofweek
    )

    df["dia_semana"] = (
        # Converte o número em texto

        df["dia_semana_numero"].apply(nome_dia_semana)
    )

    
    df["memoria_total_mb"] = (
        # Converte memória total para MB

        df["memoria_total_bytes"].apply(converter_bytes_para_mb)
    )

    
    df["memoria_disponivel_mb"] = (
        # Converte memória disponível para MB

        df["memoria_disponivel_bytes"].apply(converter_bytes_para_mb)
    )



    df["score"] = (
        # Calcula score da máquina

        df["percentual_uso_cpu"].fillna(0) * 0.4
        + df["percentual_uso_ram"].fillna(0) * 0.4
        + df["percentual_uso_disco"].fillna(0) * 0.2
    )

    
    df["criticidade"] = df["score"].apply(
        # Classifica criticidade com base no score

        classificar_criticidade
    )

    return df












def agrupar_por_dia_semana(df: pd.DataFrame) -> pd.DataFrame:
    """
    Agrupa métricas por dia da semana.
    """

    # Agrupa todas as linhas que possuem o mesmo dia da semana
    # Exemplo: Todas as Segundas ficam juntas, bem como todas as Terças, Quartas etc.
    agrupado = df.groupby("dia_semana").agg({

        # Calcula média de CPU
        "percentual_uso_cpu": "mean",

        # Calcula média de RAM
        "percentual_uso_ram": "mean",

        # Calcula média de Disco
        "percentual_uso_disco": "mean",

        # Calcula média do score
        "score": "mean",

        # Conta máquinas diferentes
        "endereco_mac": "nunique"

    }).reset_index()

    # Renomeia as colunas
    agrupado = agrupado.rename(columns={

        "percentual_uso_cpu": "media_cpu",
        "percentual_uso_ram": "media_ram",
        "percentual_uso_disco": "media_disco",
        "score": "media_score",
        "endereco_mac": "quantidade_maquinas"

    })

    # Colunas arredondadas
    colunas_media = [
        "media_cpu",
        "media_ram",
        "media_disco",
        "media_score"
    ]

    # Arredonda médias para 2 casas decimais
    for coluna in colunas_media:

        agrupado[coluna] = (
            agrupado[coluna].round(2)
        )

    # Classifica criticidade média
    agrupado["criticidade_media"] = agrupado[
        "media_score"
    ].apply(classificar_criticidade)


    # Ordenação correta dos dias da semana
    ordem = {
        "Segunda": 0,
        "Terça": 1,
        "Quarta": 2,
        "Quinta": 3,
        "Sexta": 4,
        "Sábado": 5,
        "Domingo": 6
    }

    agrupado["ordem"] = agrupado["dia_semana"].map(ordem)

    agrupado = agrupado.sort_values(
        by="ordem"
    )

    agrupado = agrupado.drop(
        columns=["ordem"]
    )

    return agrupado







def gerar_dashboard(df, df_agrupado):
    """
    Gera o JSON consumido pela dashboard.
    """

    sevidores_maior_latencia = (
        df.groupby("endereco_mac")["score"]
        .mean()
        .sort_values(ascending=False)
        .head(5)
    )

    maior_latencia = []

    for mac, score in sevidores_maior_latencia.items():

        maior_latencia.append({

            "nome": mac,
            "valor": round(score, 2),
            "cor": "#FF0000"

        })


    servidores_mais_incidentes = (
        df[df["criticidade"] == "CRITICO"]
        .groupby("endereco_mac")
        .size()
        .sort_values(ascending=False)
        .head(5)
    )

    mais_incidentes = []

    for mac, quantidade in servidores_mais_incidentes.items():

        mais_incidentes.append({

            "nome": mac,
            "valor": int(quantidade),
            "cor": "#FF0000"

        })


    tabela_de_servidores = (
        df.groupby("endereco_mac")
        .agg({
            "score": "mean",
            "criticidade": "last"
        })
        .reset_index()
    )

    servidores = []

    for _, linha in tabela_de_servidores.iterrows():

        status = "Operando"

        if linha["criticidade"] in ["ALTO", "CRITICO"]:
            status = "Atenção"

        servidores.append({

            "nome": linha["endereco_mac"],
            "status": status,
            "servidores": 1,
            "incidentes": (
                1 if linha["criticidade"] == "CRITICO"
                else 0
            ),
            "latencia": round(
                linha["score"],
                2
            )

        })



    dashboard = {

        "ultimaAtualizacao": (
            df["data_hora_iso"]
            .max()
            .strftime("%d/%m/%Y %H:%M")
        ),

        "disponibilidade": round(
            100 - df["percentual_uso_cpu"].mean(),
            2
        ),

        "incidentesAtivos": int(
            (df["criticidade"] == "CRITICO").sum()
        ),

        "servidoresCriticos": len(
            df[
                df["criticidade"] == 'CRITICO'
                ]["endereco_mac"].unique()
        ),

        "graficoSemana": [],

        "maiorLatencia": maior_latencia,
        
        "maisIncidentes": mais_incidentes,
        
        "linhas": servidores

    }

    for _, linha in df_agrupado.iterrows():

        dashboard["graficoSemana"].append({

            "dia": linha["dia_semana"],

            "valor": round(
                linha["media_score"],
                2
            )

        })

    return dashboard









def salvar_json(dashboard):
    """
    Salva o dashboard em JSON.
    """

    caminho = Path(CAMINHO_JSON)

    caminho.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        caminho,
        "w",
        encoding="utf-8"
    ) as arquivo:

        json.dump(
            dashboard,
            arquivo,
            ensure_ascii=False,
            indent=4
        )

    print("JSON salvo com sucesso!")











def salvar_csv(df: pd.DataFrame, caminho_saida: str):
    """
    Salva o CSV final.
    """

    caminho = Path(caminho_saida)

    # Cria pasta automaticamente caso não exista
    caminho.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    # Salva DataFrame em CSV
    df.to_csv(
        caminho,
        index=False
    )

    print(f"\nCSV salvo em: {caminho}")



















def main():

    print("\n========== ETL INICIADA ==========\n")

    # Carrega os CSVs
    df = carregar_csvs(
        CAMINHO_CSV
    )

    print(f"Total de linhas carregadas: {len(df)}")


    df = tratar_dados(df)


    # Aqui são criados:
    # - dia da semana
    # - score
    # - criticidade
    df = enriquecer_dados(df)

    # Agrupa os dados por dia da semana
    # Uma linha para Segunda; Uma linha para Terça; Uma linha para Quarta etc.
    df_agrupado = agrupar_por_dia_semana(df)


    dashboard = gerar_dashboard(
        df,
        df_agrupado
    )

    salvar_json(dashboard)


    print("\nResumo por dia da semana:\n")
    print(df_agrupado)

    # Salva CSV final
    salvar_csv(
        df_agrupado,
        CAMINHO_SAIDA
    )

    print("\n========== ETL FINALIZADA ==========\n")


if __name__ == "__main__":
    main()







